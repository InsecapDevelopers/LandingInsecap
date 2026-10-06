/**
 * Archivos para crawlers y agentes de IA (decisiones tarea #8, Fase 5): robots.txt,
 * sitemap-index.xml + sitemap-es.xml + sitemap-intl.xml, llms.txt y llms-full.txt.
 *
 * Los escribe scripts/prerender.mjs (vía entry-server.tsx) con el HTML ya renderizado de cada
 * página, así salen de la misma fuente que el <head> publicado:
 * - qué URL entra: la tabla seo-routes.ts (`isSeoRouteIndexable`), contrastada con el
 *   `<meta name="robots">` y la canonical del HTML. Si no coinciden, el build falla.
 * - hreflang del sitemap: los `<link rel="alternate">` de la propia página.
 * - textos de llms.txt: title y description de la página; llms-full.txt: su <main> en Markdown.
 * - lastmod: fecha real del dato (noticias: `actualizadoEn`/`publicadoEn` del TMS Plus) o del
 *   último commit de los archivos fuente de la ruta (PAGE_SOURCES, `git log -1 --format=%cI`).
 *   Las fichas salen del JSON local, no de Shopify, así que no hay `updatedAt` de Shopify que usar.
 *
 * Sin ai-catalog.json ni /.well-known/ard.json: no hay recursos ARD reales (Fase 5), y nginx
 * responde 404 real a esas rutas.
 *
 * scripts/check-dist.mjs revisa que cada URL del sitemap y de llms.txt exista en dist/ y se indexe.
 */
import { decodeHtmlEntities } from './html';
import { ORG_CREDENTIAL_NAMES, ORG_DESCRIPTION } from './jsonld';
import { SITE_URL, getLocaleFromPath } from './locale-routing';
import { isSeoRouteIndexable, matchSeoRoute, type SeoRoute } from './seo-routes';
import type { AppLanguage } from './translations';
import { COBERTURA_VIRTUAL, CONTACT_EMAIL, getCasaMatriz, sedes } from '../data/sedes';

export const SITEMAP_INDEX_FILE = 'sitemap-index.xml';
/** /es en un sitemap y /en + /pt en otro (decisión 1.3: mismos parámetros en los tres idiomas). */
export const SITEMAP_FILES: Record<'es' | 'intl', string> = { es: 'sitemap-es.xml', intl: 'sitemap-intl.xml' };

/** Bots de buscadores e IA con bloque propio en robots.txt (además de `User-agent: *`). */
export const AI_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
];

/**
 * Archivos fuente de cada ruta de seo-routes.ts: su lastmod es el commit más reciente entre ellos.
 * Una ruta indexable nueva debe agregarse aquí (el build falla si falta). Las institucionales
 * suman translations.ts, donde está su texto. `noticias/:slug` usa solo la fecha de la noticia.
 */
const TRANSLATIONS = 'src/lib/translations.ts';
const CATALOG_JSON = 'shopify_thematic_intermediate.json';
const CURSOS_SEO = 'src/data/cursos-seo.ts';
const SEDES = 'src/data/sedes.ts';

export const PAGE_SOURCES: Record<string, string[]> = {
  '': ['src/pages/Index.tsx', TRANSLATIONS],
  nosotros: ['src/pages/AboutUs.tsx', TRANSLATIONS],
  'nuestro-equipo': ['src/pages/OurTeam.tsx', TRANSLATIONS],
  'equipo-honor': ['src/pages/HonorTeam.tsx', TRANSLATIONS],
  acreditaciones: ['src/pages/Xp.tsx', TRANSLATIONS],
  'sap-pm': ['src/pages/SapSpecialty.tsx', 'src/components/SapEntorno.tsx', 'src/lib/sapCatalog.ts', TRANSLATIONS],
  simuladores: ['src/pages/SimulatorCatalog.tsx', TRANSLATIONS],
  'simuladores/modelos': ['src/pages/SimulatorModels.tsx', 'src/lib/simulatorData.ts', TRANSLATIONS],
  'simuladores/extintores': ['src/pages/SimulatorExtinguisherDetail.tsx', TRANSLATIONS],
  'nuestros-clientes': ['src/pages/Clients.tsx', 'src/data/clients.ts', TRANSLATIONS],
  contacto: ['src/pages/Contact.tsx', SEDES, TRANSLATIONS],
  'relator-trabaja-con-nosotros': ['src/pages/BeRelator.tsx', TRANSLATIONS],
  'politica-calidad': ['src/pages/QualityPolicy.tsx', TRANSLATIONS],
  'politica-de-privacidad': ['src/pages/PrivacyPolicy.tsx', TRANSLATIONS],
  'cursos-abiertos': ['src/pages/OpenCoursesCatalog.tsx', 'src/lib/openCourses.ts', TRANSLATIONS],
  cursos: ['src/pages/CursosIndex.tsx', CURSOS_SEO, CATALOG_JSON],
  'cursos/categoria/:area': ['src/pages/CursoCategoria.tsx', CURSOS_SEO, CATALOG_JSON],
  'cursos/:slug': ['src/pages/CursoFicha.tsx', CURSOS_SEO, CATALOG_JSON],
  'sedes/:sede': ['src/pages/SedeDetail.tsx', SEDES, CURSOS_SEO],
  'franquicia-sence': ['src/pages/FranquiciaSence.tsx'],
  'preguntas-frecuentes': ['src/pages/PreguntasFrecuentes.tsx', CURSOS_SEO, SEDES],
  noticias: ['src/pages/Blog.tsx'],
  'noticias/:slug': [],
};

/** Todos los archivos de PAGE_SOURCES (prerender.mjs revisa que existan). */
export const listPageSourceFiles = () => Array.from(new Set(Object.values(PAGE_SOURCES).flat())).sort();

type LlmsSection = 'Cursos' | 'Sedes' | 'Información' | 'Optional';

/** Sección de llms.txt por ruta, en el orden en que se listan. Lo que no está aquí va a Optional. */
const LLMS_SECTIONS: Array<[string, LlmsSection]> = [
  ['cursos', 'Cursos'],
  ['cursos/categoria/:area', 'Cursos'],
  ['cursos/:slug', 'Cursos'],
  ['cursos-abiertos', 'Cursos'],
  ['sap-pm', 'Cursos'],
  ['simuladores', 'Cursos'],
  ['simuladores/modelos', 'Cursos'],
  ['simuladores/extintores', 'Cursos'],
  ['sedes/:sede', 'Sedes'],
  ['contacto', 'Sedes'],
  ['', 'Información'],
  ['nosotros', 'Información'],
  ['acreditaciones', 'Información'],
  ['franquicia-sence', 'Información'],
  ['preguntas-frecuentes', 'Información'],
  ['nuestros-clientes', 'Información'],
  ['noticias', 'Información'],
];
const LLMS_SECTION_ORDER: LlmsSection[] = ['Cursos', 'Sedes', 'Información', 'Optional'];

/** Páginas de llms-full.txt (solo /es y solo si se indexan), en este orden. */
const LLMS_FULL_ROUTES = ['', 'nosotros', 'acreditaciones', 'sedes/:sede', 'franquicia-sence', 'preguntas-frecuentes', 'cursos/:slug'];

const LANGUAGE_NAMES: Record<AppLanguage, string> = { es: 'español', en: 'English', pt: 'Português' };

// ---------- HTML ----------

const decode = (text: string) => decodeHtmlEntities(text);

/** Atributos de una etiqueta, con nombres en minúscula (Helmet escribe `hrefLang`). */
const tagAttributes = (tag: string): Record<string, string> =>
  Object.fromEntries([...tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)].map(([, name, value]) => [name.toLowerCase(), decode(value)]));

const findTags = (html: string, regex: RegExp) => [...html.matchAll(regex)].map(([tag]) => tagAttributes(tag));

const inlineText = (html: string) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

const head = (html: string) => html.slice(0, Math.max(0, html.search(/<body[\s>]/i)));

const readPageMeta = (html: string) => {
  const headHtml = head(html);
  return {
    title: inlineText((headHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] ?? ''),
    description: findTags(headHtml, /<meta[^>]+name="description"[^>]*>/gi)[0]?.content ?? '',
    robots: findTags(headHtml, /<meta[^>]+name="robots"[^>]*>/gi)[0]?.content ?? '',
    canonical: findTags(headHtml, /<link[^>]+rel="canonical"[^>]*>/gi)[0]?.href ?? '',
    alternates: findTags(headHtml, /<link[^>]+rel="alternate"[^>]*hreflang="[^"]*"[^>]*>/gi)
      .map((link) => ({ hreflang: link.hreflang, href: link.href })),
    h1: inlineText((html.match(/<h1[\s>][\s\S]*?<\/h1>/i) || [''])[0]),
    main: (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [])[1] ?? '',
  };
};

const escapeMarkdownText = (text: string) => text.replace(/([[\]])/g, '\\$1');

/** Texto de una celda o un ítem: los bloques internos se separan con " · ". */
const blockText = (html: string) =>
  inlineText(html.replace(/<br\s*\/?>|<\/(div|p|li)>/gi, ' · '))
    .replace(/(\s*·\s*)+/g, ' · ')
    .replace(/^· |(?: ·)+$/g, '')
    .trim();

/**
 * Markdown legible del <main> de una página prerenderizada (llms-full.txt). Conserva encabezados,
 * párrafos, listas, tablas y enlaces (absolutos); quita navegación, formularios, botones, SVG y
 * lo marcado con aria-hidden. `headingOffset` baja los encabezados (h1 → ### con 2).
 */
export const htmlToMarkdown = (html: string, headingOffset = 0): string => {
  let text = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|svg|noscript|template|form|button|select|textarea|video|iframe|nav)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(\w+)\b[^>]*\saria-hidden="true"[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(img|input|hr)\b[^>]*>/gi, ' ');

  // Enlaces. Una tarjeta (enlace con encabezado o bloques) va en su propia línea con el texto de su encabezado.
  text = text.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_, attrs: string, inner: string) => {
    const href = tagAttributes(`<a ${attrs}>`).href ?? '';
    const heading = inner.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
    const label = inlineText(heading ? heading[1] : inner);
    if (!label) return ' ';
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return ` ${label} `;
    const link = `[${escapeMarkdownText(label)}](${href.startsWith('/') ? `${SITE_URL}${href}` : href})`;
    return heading || /<(div|p|h[1-6])\b/i.test(inner) ? `\n\n- ${link}\n\n` : ` ${link} `;
  });

  text = text.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => {
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(([, row]) =>
      [...row.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(([, cell]) => blockText(cell).replace(/\|/g, '\\|')));
    if (rows.length === 0) return ' ';
    const width = Math.max(...rows.map((row) => row.length));
    const line = (cells: string[]) => `| ${Array.from({ length: width }, (_, index) => cells[index] ?? '').join(' | ')} |`;
    return `\n\n${[line(rows[0]), line(Array(width).fill('---')), ...rows.slice(1).map(line)].join('\n')}\n\n`;
  });

  text = text
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, inner: string) => {
      const item = blockText(inner);
      return item ? `\n- ${item.replace(/^- /, '')}\n` : '\n';
    })
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level: string, inner: string) => {
      const heading = inlineText(inner);
      return heading ? `\n\n${'#'.repeat(Math.min(6, Number(level) + headingOffset))} ${heading}\n\n` : ' ';
    })
    .replace(/<(p|dt|dd|figcaption|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag: string, inner: string) => `\n\n${inlineText(inner)}\n\n`)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(div|section|article|header|footer|ul|ol|dl|aside|address|figure|main)\b[^>]*>/gi, '\n');

  const lines = decode(text.replace(/<[^>]*>/g, ' '))
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter((line) => line !== '-');

  const out: string[] = [];
  for (const line of lines) {
    const previous = out[out.length - 1];
    if (line === '' && (out.length === 0 || previous === '')) continue;
    // Ítems de lista seguidos, sin línea en blanco entre ellos.
    if (line.startsWith('- ') && previous === '' && out[out.length - 2]?.startsWith('- ')) out.pop();
    out.push(line);
  }
  return out.join('\n').trim();
};

// ---------- Datos de cada página ----------

export interface CrawlerPage {
  /** Ruta con prefijo de idioma (`/es/nosotros`). */
  url: string;
  /** HTML completo prerenderizado. */
  html: string;
}

export interface CrawlerFilesOptions {
  /** Fecha ISO 8601 del último commit de un archivo fuente; null si no se conoce. */
  sourceLastmod: (file: string) => string | null;
  /** Fecha del dato de una URL (noticias); null si la ruta no depende de datos con fecha. */
  dataLastmod: (url: string) => string | null;
}

interface IndexablePage {
  url: string;
  loc: string;
  locale: AppLanguage;
  route: SeoRoute;
  title: string;
  h1: string;
  description: string;
  alternates: Array<{ hreflang: string; href: string }>;
  lastmod: string | null;
  main: string;
}

/** La fecha más reciente (comparando instantes); null si no hay ninguna. */
const latest = (dates: Array<string | null | undefined>): string | null =>
  dates
    .filter((date): date is string => Boolean(date) && !Number.isNaN(Date.parse(date as string)))
    .reduce<string | null>((best, date) => (best === null || Date.parse(date) > Date.parse(best) ? date : best), null);

const collectIndexablePages = (pages: CrawlerPage[], options: CrawlerFilesOptions) => {
  const errors: string[] = [];
  const indexable: IndexablePage[] = [];

  for (const { url, html } of pages) {
    const match = matchSeoRoute(url);
    const locale = getLocaleFromPath(url);
    if (!match || !locale) continue;

    const meta = readPageMeta(html);
    const shouldIndex = isSeoRouteIndexable(match.route, locale, url);
    if (shouldIndex !== /^index/i.test(meta.robots)) {
      errors.push(`${url}: seo-routes dice ${shouldIndex ? 'index' : 'noindex'} y el HTML robots="${meta.robots}"`);
      continue;
    }
    if (!shouldIndex) continue;

    const loc = `${SITE_URL}${url}`;
    if (meta.canonical !== loc) {
      errors.push(`${url}: indexable con canonical "${meta.canonical}" (debe ser ${loc})`);
      continue;
    }
    const sources = PAGE_SOURCES[match.route.path];
    if (!sources) {
      errors.push(`${url}: la ruta "${match.route.path}" no tiene PAGE_SOURCES (src/lib/crawler-files.ts)`);
      continue;
    }

    indexable.push({
      url,
      loc,
      locale,
      route: match.route,
      title: meta.title.replace(/\s*\|\s*INSECAP$/, ''),
      h1: meta.h1,
      description: meta.description,
      alternates: meta.alternates,
      lastmod: latest([...sources.map(options.sourceLastmod), options.dataLastmod(url)]),
      main: meta.main,
    });
  }

  if (errors.length > 0) {
    throw new Error(`[crawler-files] ${errors.length} problema(s):\n  - ${errors.join('\n  - ')}`);
  }
  return indexable;
};

// ---------- robots.txt ----------

export const buildRobotsTxt = () => [
  '# robots.txt de insecap.cl: lo genera scripts/prerender.mjs (src/lib/crawler-files.ts). Tarea #8, Fase 5.',
  '# Buscadores y asistentes de IA pueden rastrear todo el sitio salvo /api/.',
  '',
  'User-agent: *',
  'Allow: /',
  'Disallow: /api/',
  '',
  '# Bloque explícito para buscadores y agentes de IA (un bot con bloque propio ignora el de *).',
  ...AI_BOTS.map((bot) => `User-agent: ${bot}`),
  'Allow: /',
  'Disallow: /api/',
  '',
  `Sitemap: ${SITE_URL}/${SITEMAP_INDEX_FILE}`,
  '',
].join('\n');

// ---------- Sitemaps ----------

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const urlset = (pages: IndexablePage[]) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...pages.map((page) => [
    '  <url>',
    `    <loc>${escapeXml(page.loc)}</loc>`,
    ...(page.lastmod ? [`    <lastmod>${escapeXml(page.lastmod)}</lastmod>`] : []),
    ...page.alternates.map((alternate) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}"/>`),
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');

const sitemapIndex = (entries: Array<{ file: string; lastmod: string | null }>) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(({ file, lastmod }) => [
    '  <sitemap>',
    `    <loc>${SITE_URL}/${file}</loc>`,
    ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
    '  </sitemap>',
  ].join('\n')),
  '</sitemapindex>',
  '',
].join('\n');

// ---------- llms.txt y llms-full.txt ----------

const listarNombres = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

/** Encabezado común de llms.txt y llms-full.txt: H1 y resumen en blockquote, solo con datos del sitio. */
const llmsIntro = (title: string) => {
  const casaMatriz = getCasaMatriz();
  const ciudades = sedes.map((sede) => (sede.casaMatriz ? `${sede.ciudad} (casa matriz)` : sede.ciudad));
  return [
    `# ${title}`,
    '',
    `> INSECAP es una ${ORG_DESCRIPTION}`,
    '',
    `Acreditaciones y certificaciones: ${ORG_CREDENTIAL_NAMES.join('; ')}. ` +
      `Sedes en ${listarNombres(ciudades)}; cursos e-learning con cobertura ${COBERTURA_VIRTUAL}. ` +
      `Contacto: ${CONTACT_EMAIL}, ${casaMatriz.telefono} (${casaMatriz.nombre}). ` +
      'Contenido en español de Chile; las páginas institucionales también están en inglés y portugués.',
  ];
};

const sectionOf = (page: IndexablePage): LlmsSection =>
  page.locale === 'es' ? LLMS_SECTIONS.find(([path]) => path === page.route.path)?.[1] ?? 'Optional' : 'Optional';

const sectionRank = (page: IndexablePage) => {
  const index = LLMS_SECTIONS.findIndex(([path]) => path === page.route.path);
  return { es: 0, en: 1000, pt: 2000 }[page.locale] + (index === -1 ? 500 : index);
};

const llmsLink = (page: IndexablePage) => {
  // Las noticias usan su H1 completo (el title puede venir recortado a 60 caracteres).
  const label = page.route.path === 'noticias/:slug' ? page.h1 || page.title : page.title || page.h1;
  const language = page.locale === 'es' ? '' : ` (${LANGUAGE_NAMES[page.locale]})`;
  return `- [${escapeMarkdownText(label)}${language}](${page.loc})${page.description ? `: ${page.description}` : ''}`;
};

const buildLlmsTxt = (pages: IndexablePage[]) => {
  const sorted = [...pages].sort((a, b) => sectionRank(a) - sectionRank(b));
  const lines = [
    ...llmsIntro('INSECAP Capacitación'),
    '',
    `Contenido de las páginas clave en Markdown: ${SITE_URL}/llms-full.txt. Mapa del sitio: ${SITE_URL}/${SITEMAP_INDEX_FILE}.`,
  ];
  for (const section of LLMS_SECTION_ORDER) {
    const items = sorted.filter((page) => sectionOf(page) === section);
    if (items.length === 0) continue;
    lines.push('', `## ${section}`, '', ...items.map(llmsLink));
  }
  return `${lines.join('\n')}\n`;
};

const buildLlmsFullTxt = (pages: IndexablePage[]) => {
  const selected = LLMS_FULL_ROUTES.flatMap((routePath) =>
    pages.filter((page) => page.locale === 'es' && page.route.path === routePath));
  const lines = [
    ...llmsIntro('INSECAP Capacitación: contenido de las páginas clave'),
    '',
    `Texto de cada página tal como se publica en ${SITE_URL}, en Markdown. Índice del sitio: ${SITE_URL}/llms.txt.`,
  ];
  for (const page of selected) {
    lines.push(
      '',
      `## ${page.title || page.h1}`,
      '',
      `URL: ${page.loc}`,
      ...(page.lastmod ? [`Última actualización: ${page.lastmod.slice(0, 10)}`] : []),
      '',
      htmlToMarkdown(page.main, 2),
    );
  }
  return `${lines.join('\n')}\n`;
};

/**
 * Contenido de robots.txt, los sitemaps, llms.txt y llms-full.txt, por nombre de archivo en dist/.
 * Lanza si una página contradice a seo-routes.ts (robots o canonical) o si falta PAGE_SOURCES.
 */
export const buildCrawlerFiles = (pages: CrawlerPage[], options: CrawlerFilesOptions) => {
  const indexable = collectIndexablePages(pages, options);
  const es = indexable.filter((page) => page.locale === 'es');
  const intl = indexable.filter((page) => page.locale !== 'es');

  const files: Record<string, string> = {
    'robots.txt': buildRobotsTxt(),
    [SITEMAP_FILES.es]: urlset(es),
    [SITEMAP_FILES.intl]: urlset(intl),
    [SITEMAP_INDEX_FILE]: sitemapIndex([
      { file: SITEMAP_FILES.es, lastmod: latest(es.map((page) => page.lastmod)) },
      { file: SITEMAP_FILES.intl, lastmod: latest(intl.map((page) => page.lastmod)) },
    ]),
    'llms.txt': buildLlmsTxt(indexable),
    'llms-full.txt': buildLlmsFullTxt(indexable),
  };

  return {
    files,
    urls: indexable.length,
    withoutLastmod: indexable.filter((page) => !page.lastmod).map((page) => page.url),
  };
};
