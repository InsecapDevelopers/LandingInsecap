/**
 * Exporta el catálogo B2B (cursos para empresas) desde Shopify a un JSON crudo,
 * descargando las imágenes y subiéndolas opcionalmente a DigitalOcean Spaces.
 *
 * Uso:
 *   node scripts/export-b2b.mjs [--dry-run] [--query="tag:b2b"]
 *
 * Variables de entorno (todas opcionales):
 *   SHOPIFY_STORE / SHOPIFY_STOREFRONT_TOKEN   sobrescriben la tienda por defecto
 *   DO_SPACES_KEY / DO_SPACES_SECRET / DO_SPACES_REGION / DO_SPACES_BUCKET
 *   DO_SPACES_CDN / DO_SPACES_PREFIX (default "cursos")
 *   IMAGE_BASE_URL  base para reescribir URLs cuando no se sube a Spaces
 *
 * Salida: b2b-export/products.json + b2b-export/images/
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const STORE = process.env.SHOPIFY_STORE || 'qvs57u-ve.myshopify.com';
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN || '6956b61adb84bc00884de1664986ce6f';
const API_VERSION = '2025-07';
const STOREFRONT_URL = `https://${STORE}/api/${API_VERSION}/graphql.json`;

const queryArg = process.argv.find((a) => a.startsWith('--query='));
const SHOPIFY_QUERY = queryArg ? queryArg.split('=').slice(1).join('=') : 'tag:b2b';
const DRY_RUN = process.argv.includes('--dry-run');

const SPACES = {
  key: process.env.DO_SPACES_KEY || '',
  secret: process.env.DO_SPACES_SECRET || '',
  region: process.env.DO_SPACES_REGION || '',
  bucket: process.env.DO_SPACES_BUCKET || '',
  prefix: (process.env.DO_SPACES_PREFIX || 'cursos').replace(/\/+$/, ''),
};
SPACES.cdn = process.env.DO_SPACES_CDN || `https://${SPACES.bucket}.${SPACES.region}.cdn.digitaloceanspaces.com`;
const SPACES_ENABLED = Boolean(SPACES.key && SPACES.secret && SPACES.region && SPACES.bucket);

const OUT_DIR = path.join(process.cwd(), 'b2b-export');
const IMAGES_DIR = path.join(OUT_DIR, 'images');

// ---------------------------------------------------------------------------
// Extracción
// ---------------------------------------------------------------------------
const PRODUCTS_QUERY = `
  query GetB2bProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      pageInfo { hasNextPage endCursor }
      edges { node {
        id title handle description descriptionHtml productType vendor tags
        featuredImage { url altText }
        images(first: 10) { edges { node { url altText } } }
        collections(first: 10) { edges { node { title handle } } }
        variants(first: 100) { edges { node {
          id sku availableForSale
          selectedOptions { name value }
        } } }
      } }
    }
  }
`;

async function fetchProducts() {
  const productos = [];
  let after = null;
  do {
    const res = await fetch(STOREFRONT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { first: 50, after, query: SHOPIFY_QUERY } }),
    });
    if (!res.ok) throw new Error(`Storefront API: ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
    const conn = json.data.products;
    for (const { node } of conn.edges) {
      productos.push({
        shopify_id: node.id,
        titulo: node.title,
        slug: node.handle,
        descripcion: node.description,
        descripcion_html: node.descriptionHtml,
        categoria: node.productType,
        vendor: node.vendor,
        tags: node.tags,
        imagen: node.featuredImage?.url || null,
        imagen_alt: node.featuredImage?.altText || null,
        imagenes: node.images.edges.map((e) => e.node.url),
        colecciones: node.collections.edges.map((e) => e.node.title),
        variantes: node.variants.edges.map(({ node: v }) => ({
          sku: v.sku,
          disponible: v.availableForSale,
          opciones: Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value])),
        })),
      });
    }
    after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (after);
  return productos;
}

// ---------------------------------------------------------------------------
// Imágenes (mismo mecanismo que export-news.mjs: S3 SigV4 sin dependencias)
// ---------------------------------------------------------------------------
const CONTENT_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.avif': 'image/avif',
};
const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();
const sha256hex = (data) => crypto.createHash('sha256').update(data).digest('hex');

async function uploadToSpaces(key, body, contentType) {
  const host = `${SPACES.bucket}.${SPACES.region}.digitaloceanspaces.com`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = amzDate.slice(0, 8);
  const payloadHash = sha256hex(body);
  const signedHeaders = 'host;x-amz-acl;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = [
    'PUT', `/${key}`, '',
    `host:${host}\nx-amz-acl:public-read\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`,
    signedHeaders, payloadHash,
  ].join('\n');
  const scope = `${date}/${SPACES.region}/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256hex(canonicalRequest)].join('\n');
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${SPACES.secret}`, date), SPACES.region), 's3'), 'aws4_request');
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const res = await fetch(`https://${host}/${key}`, {
    method: 'PUT',
    headers: {
      Authorization: `AWS4-HMAC-SHA256 Credential=${SPACES.key}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      'x-amz-acl': 'public-read',
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      'Content-Type': contentType,
    },
    body,
  });
  if (!res.ok) throw new Error(`Spaces PUT ${key}: ${res.status}`);
}

function imageFileName(url) {
  const base = path.basename(new URL(url).pathname).replace(/[^a-zA-Z0-9._-]/g, '');
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${hash}-${base}`;
}

async function migrateImage(url, cache) {
  if (cache.has(url)) return cache.get(url);
  const fileName = imageFileName(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Descarga ${url}: ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(IMAGES_DIR, fileName), body);

  let newUrl;
  if (SPACES_ENABLED) {
    const key = `${SPACES.prefix}/${fileName}`;
    const contentType = CONTENT_TYPES[path.extname(fileName).toLowerCase()] || 'application/octet-stream';
    await uploadToSpaces(key, body, contentType);
    newUrl = `${SPACES.cdn}/${key}`;
  } else {
    const base = (process.env.IMAGE_BASE_URL || '/cursos').replace(/\/+$/, '');
    newUrl = `${base}/${fileName}`;
  }
  cache.set(url, newUrl);
  return newUrl;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`Tienda: ${STORE} · query: "${SHOPIFY_QUERY}"`);
  const productos = await fetchProducts();
  const variantes = productos.reduce((s, p) => s + p.variantes.length, 0);
  console.log(`Productos: ${productos.length} · variantes: ${variantes}`);
  console.log(`Sin imagen: ${productos.filter((p) => !p.imagen).length}`);

  const urls = new Set(productos.flatMap((p) => p.imagenes));
  console.log(`Imágenes referenciadas: ${urls.size}`);
  console.log(`Destino: ${SPACES_ENABLED ? `Spaces ${SPACES.bucket}/${SPACES.prefix}` : 'solo local (sin credenciales DO_SPACES_*)'}`);

  if (DRY_RUN) {
    productos.forEach((p) => console.log(`  [${p.categoria.slice(0, 22).padEnd(22)}] ${p.slug} (${p.variantes.length} var.)`));
    console.log('--dry-run: no se descargó ni escribió nada.');
    return;
  }

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const cache = new Map();
  let fallidas = 0;
  for (const url of urls) {
    try {
      await migrateImage(url, cache);
    } catch (err) {
      fallidas += 1;
      console.error(`  ✗ ${err.message}`);
    }
  }
  console.log(`Imágenes migradas: ${cache.size}${fallidas ? `, fallidas: ${fallidas}` : ''}`);

  for (const p of productos) {
    if (p.imagen && cache.has(p.imagen)) p.imagen = cache.get(p.imagen);
    p.imagenes = p.imagenes.map((u) => cache.get(u) || u);
  }

  const outFile = path.join(OUT_DIR, 'products.json');
  fs.writeFileSync(outFile, JSON.stringify(productos, null, 2));
  console.log(`Listo: ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
