/**
 * Exporta los artículos del blog de Shopify a un JSON importable en el sistema interno,
 * descargando las imágenes y subiéndolas (opcionalmente) a DigitalOcean Spaces.
 *
 * Uso:
 *   node scripts/export-news.mjs [--dry-run] [--blogs=noticias,news]
 *
 * Variables de entorno:
 *   SHOPIFY_ADMIN_TOKEN   (opcional) token Admin API — necesario para traer artículos OCULTOS.
 *                         Sin él usa la Storefront API pública (solo artículos visibles).
 *   SHOPIFY_STORE         dominio *.myshopify.com (default: insecap-capacitaciones.myshopify.com)
 *   DO_SPACES_KEY / DO_SPACES_SECRET / DO_SPACES_REGION / DO_SPACES_BUCKET
 *                         (opcionales) credenciales de Spaces. Sin ellas, las imágenes quedan
 *                         solo en news-export/images/ y las URLs se reescriben con IMAGE_BASE_URL.
 *   DO_SPACES_CDN         (opcional) base pública, default https://{bucket}.{region}.cdn.digitaloceanspaces.com
 *   DO_SPACES_PREFIX      (opcional) carpeta destino en el bucket, default "noticias"
 *   IMAGE_BASE_URL        (opcional) base para reescribir URLs cuando no se sube a Spaces
 *
 * Salida: news-export/articles.json + news-export/images/
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const STORE = process.env.SHOPIFY_STORE || 'insecap-capacitaciones.myshopify.com';
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN || '';
const ADMIN_API_VERSION = '2024-07';
const STOREFRONT_URL = `https://${STORE}/api/2026-01/graphql.json`;

const SPACES = {
  key: process.env.DO_SPACES_KEY || '',
  secret: process.env.DO_SPACES_SECRET || '',
  region: process.env.DO_SPACES_REGION || '',
  bucket: process.env.DO_SPACES_BUCKET || '',
  prefix: (process.env.DO_SPACES_PREFIX || 'noticias').replace(/\/+$/, ''),
};
SPACES.cdn = process.env.DO_SPACES_CDN || `https://${SPACES.bucket}.${SPACES.region}.cdn.digitaloceanspaces.com`;
const SPACES_ENABLED = Boolean(SPACES.key && SPACES.secret && SPACES.region && SPACES.bucket);

const DRY_RUN = process.argv.includes('--dry-run');
const blogsArg = process.argv.find((a) => a.startsWith('--blogs='));
const STOREFRONT_BLOGS = blogsArg ? blogsArg.split('=')[1].split(',') : ['noticias', 'news'];

const OUT_DIR = path.join(process.cwd(), 'news-export');
const IMAGES_DIR = path.join(OUT_DIR, 'images');

// ---------------------------------------------------------------------------
// Fuente 1: Admin API (completa: incluye artículos ocultos y todos los blogs)
// ---------------------------------------------------------------------------
async function adminGet(pathname) {
  const res = await fetch(`https://${STORE}/admin/api/${ADMIN_API_VERSION}/${pathname}`, {
    headers: { 'X-Shopify-Access-Token': ADMIN_TOKEN },
  });
  if (!res.ok) throw new Error(`Admin API ${pathname}: ${res.status} ${await res.text()}`);
  return { data: await res.json(), link: res.headers.get('link') || '' };
}

function nextPageInfo(link) {
  const match = link.match(/<[^>]*[?&]page_info=([^&>]+)[^>]*>;\s*rel="next"/);
  return match ? match[1] : null;
}

async function fetchViaAdmin() {
  const { data: blogsData } = await adminGet('blogs.json');
  const articles = [];
  for (const blog of blogsData.blogs) {
    let pageInfo = null;
    do {
      const qs = pageInfo ? `limit=250&page_info=${pageInfo}` : 'limit=250';
      const { data, link } = await adminGet(`blogs/${blog.id}/articles.json?${qs}`);
      for (const a of data.articles) {
        articles.push({
          shopify_id: String(a.id),
          blog_handle: blog.handle,
          title: a.title,
          slug: a.handle,
          excerpt: a.summary_html || null,
          content_html: a.body_html || '',
          cover_image: a.image?.src || null,
          cover_image_alt: a.image?.alt || null,
          author: a.author || null,
          tags: a.tags ? a.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
          published_at: a.published_at,
          updated_at: a.updated_at,
          visible: Boolean(a.published_at),
        });
      }
      pageInfo = nextPageInfo(link);
    } while (pageInfo);
  }
  return articles;
}

// ---------------------------------------------------------------------------
// Fuente 2: Storefront API pública (fallback: solo artículos visibles)
// ---------------------------------------------------------------------------
const STOREFRONT_QUERY = `
  query GetBlogArticles($handle: String!, $first: Int!, $after: String) {
    blog(handle: $handle) {
      articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
        pageInfo { hasNextPage endCursor }
        edges { node {
          id title handle publishedAt excerpt contentHtml tags
          image { url altText }
          authorV2 { name }
        } }
      }
    }
  }
`;

async function fetchViaStorefront() {
  const articles = [];
  for (const handle of STOREFRONT_BLOGS) {
    let after = null;
    do {
      const res = await fetch(STOREFRONT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: STOREFRONT_QUERY, variables: { handle, first: 50, after } }),
      });
      if (!res.ok) throw new Error(`Storefront API: ${res.status}`);
      const json = await res.json();
      if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
      const conn = json.data?.blog?.articles;
      if (!conn) break; // el blog no existe con este handle
      for (const { node } of conn.edges) {
        articles.push({
          shopify_id: node.id,
          blog_handle: handle,
          title: node.title,
          slug: node.handle,
          excerpt: node.excerpt || null,
          content_html: node.contentHtml || '',
          cover_image: node.image?.url || null,
          cover_image_alt: node.image?.altText || null,
          author: node.authorV2?.name || null,
          tags: node.tags || [],
          published_at: node.publishedAt,
          updated_at: null,
          visible: true,
        });
      }
      after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
    } while (after);
  }
  return articles;
}

// ---------------------------------------------------------------------------
// Imágenes: descarga + subida a DigitalOcean Spaces (S3 SigV4, sin dependencias)
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
  if (!res.ok) throw new Error(`Spaces PUT ${key}: ${res.status} ${await res.text()}`);
}

function imageFileName(url) {
  const clean = new URL(url);
  const base = path.basename(clean.pathname).replace(/[^a-zA-Z0-9._-]/g, '');
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${hash}-${base}`;
}

/** Descarga una imagen, la sube a Spaces (si hay credenciales) y devuelve su nueva URL. */
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
    const base = (process.env.IMAGE_BASE_URL || '/noticias').replace(/\/+$/, '');
    newUrl = `${base}/${fileName}`;
  }
  cache.set(url, newUrl);
  return newUrl;
}

const SHOPIFY_IMG_REGEX = /https:\/\/cdn\.shopify\.com\/[^\s"'\\)>]+/g;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`Fuente: ${ADMIN_TOKEN ? 'Admin API (incluye ocultos)' : 'Storefront API pública (SOLO visibles — define SHOPIFY_ADMIN_TOKEN para traer los ocultos)'}`);
  const articles = ADMIN_TOKEN ? await fetchViaAdmin() : await fetchViaStorefront();
  console.log(`Artículos encontrados: ${articles.length} (${articles.filter((a) => !a.visible).length} ocultos)`);

  const allImageUrls = new Set();
  for (const a of articles) {
    if (a.cover_image) allImageUrls.add(a.cover_image);
    for (const m of a.content_html.match(SHOPIFY_IMG_REGEX) || []) allImageUrls.add(m);
  }
  console.log(`Imágenes referenciadas: ${allImageUrls.size}`);
  console.log(`Destino de imágenes: ${SPACES_ENABLED ? `Spaces ${SPACES.bucket}/${SPACES.prefix} (${SPACES.cdn})` : 'solo local (sin credenciales DO_SPACES_*)'}`);

  if (DRY_RUN) {
    for (const a of articles) console.log(`  [${a.visible ? 'visible' : 'OCULTO '}] ${a.blog_handle}/${a.slug}`);
    console.log('--dry-run: no se descargó ni escribió nada.');
    return;
  }

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const cache = new Map();
  let failed = 0;
  for (const url of allImageUrls) {
    try {
      await migrateImage(url, cache);
    } catch (err) {
      failed += 1;
      console.error(`  ✗ ${err.message}`);
    }
  }
  console.log(`Imágenes migradas: ${cache.size}${failed ? `, fallidas: ${failed} (conservan URL original)` : ''}`);

  for (const a of articles) {
    if (a.cover_image && cache.has(a.cover_image)) a.cover_image = cache.get(a.cover_image);
    a.content_html = a.content_html.replace(SHOPIFY_IMG_REGEX, (u) => cache.get(u) || u);
  }

  const outFile = path.join(OUT_DIR, 'articles.json');
  fs.writeFileSync(outFile, JSON.stringify(articles, null, 2));
  console.log(`Listo: ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
