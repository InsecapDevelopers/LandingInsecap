import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { buildLocalizedPath, getLocaleFromPath, getLocaleMeta, isAbsoluteUrl, SITE_URL, stripLocaleFromPath } from '@/lib/locale-routing';
import { findSeoRoute, getRobotsForPath, getSeoPageKey, isSeoRouteIndexable } from '@/lib/seo-routes';
import {
  buildSeoTitle,
  DEFAULT_OG_IMAGE,
  fitDescription,
  getSeoFillers,
  getSeoImageAlt,
  getSeoPageText,
  TWITTER_SITE,
} from '@/lib/seo-text';
import { fallbackLanguage, supportedLanguages } from '@/lib/translations';
import { serializeJsonLd, toJsonLdGraph, type JsonLdNode } from '@/lib/jsonld';
import { CONTACT_EMAIL, getCasaMatriz } from '@/data/sedes';

/** NAP único (Fase 8): `{{telefonoCasaMatriz}}`, `{{ciudadCasaMatriz}}` y `{{email}}` de `seo.pages` salen de src/data/sedes.ts. */
const NAP_PARAMS = {
  telefonoCasaMatriz: getCasaMatriz().telefono,
  ciudadCasaMatriz: getCasaMatriz().ciudad,
  email: CONTACT_EMAIL,
};

interface SEOProps {
  /** Keyword del title, sin la marca (se agrega " | INSECAP"). Por defecto, `seo.pages` de la ruta. */
  title?: string;
  /** Texto base de la description; se ajusta a 140–155. Por defecto, `seo.pages` de la ruta. */
  description?: string;
  /** Valores para los `{{param}}` de los textos de `seo.pages`. */
  seoParams?: Record<string, string | number>;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  /** Nodos schema.org de la página (sin @context); null y undefined se ignoran. */
  jsonLd?: JsonLdNode | Array<JsonLdNode | null | undefined>;
  /**
   * Capa base de RouteMeta (AppShell.tsx): no emite og:image:width/height/type. Helmet conserva
   * las etiquetas de una instancia anterior que la siguiente no repite, así que si la base los
   * emitiera, una página con imagen propia (noticias: JPEG externo de otro tamaño) heredaría los
   * 1200×630 image/png de la imagen por defecto. Cada página con la imagen por defecto los emite.
   */
  base?: boolean;
}

/**
 * Metadatos de una página (Fase 3, tarea #8): title ≤60 con la marca al final, description de
 * 140–155 única por ruta e idioma, canonical absoluta, hreflang recíproco desde seo-routes.ts,
 * robots, Open Graph y Twitter con la imagen 1200×630 del dominio.
 * RouteMeta (AppShell.tsx) lo monta sin props en todas las rutas; el <SEO> de cada página lo
 * sobrescribe porque se monta después.
 */
const SEO = ({
  title,
  description,
  seoParams,
  image,
  imageAlt,
  url,
  type = 'website',
  article,
  jsonLd,
  base = false,
}: SEOProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  const siteName = t('seo.siteName');
  const baseUrl = SITE_URL;
  const currentLocale = getLocaleFromPath(location.pathname) ?? fallbackLanguage;
  const localeMeta = getLocaleMeta(currentLocale);
  const sourcePath = url && !isAbsoluteUrl(url) ? url : location.pathname;
  const localizedPath = url
    ? (isAbsoluteUrl(url) ? url : buildLocalizedPath(sourcePath, currentLocale))
    : location.pathname;
  const pathWithoutLocale = stripLocaleFromPath(sourcePath);
  const seoRoute = findSeoRoute(location.pathname);

  // Textos escritos a mano de la ruta (translations.ts → seo.pages); fuera de la tabla, los del 404.
  const pageKey = seoRoute ? getSeoPageKey(seoRoute) : 'notFound';
  const pageText = pageKey ? getSeoPageText(currentLocale, pageKey, { ...NAP_PARAMS, ...seoParams }) : null;

  // hreflang desde la tabla (seo-routes.ts): solo si esta página se indexa, y solo hacia los
  // idiomas en que la misma ruta también se indexa. Páginas de datos en /es: es-CL + x-default;
  // en /en y /pt (noindex) no llevan hreflang.
  const hreflangLocales = seoRoute && isSeoRouteIndexable(seoRoute, currentLocale, location.pathname)
    ? supportedLanguages.filter((language) =>
      isSeoRouteIndexable(seoRoute, language, buildLocalizedPath(pathWithoutLocale, language)))
    : [];
  const alternateLinks = hreflangLocales.map((language) => {
    const meta = getLocaleMeta(language);
    return {
      hrefLang: meta.hreflang,
      href: `${baseUrl}${buildLocalizedPath(pathWithoutLocale, language)}`,
    };
  });

  const finalTitle = buildSeoTitle(title ?? pageText?.title);
  const finalDescription = fitDescription(description ?? pageText?.description, getSeoFillers(currentLocale));
  const isDefaultImage = !image;
  // El tamaño y el tipo solo se conocen para la imagen por defecto; una imagen propia va sin ellos.
  const emitImageSize = isDefaultImage && !base;
  const imagePath = image ?? DEFAULT_OG_IMAGE.path;
  const finalImage = isAbsoluteUrl(imagePath) ? imagePath : `${baseUrl}${imagePath}`;
  const finalImageAlt = imageAlt || (isDefaultImage ? getSeoImageAlt(currentLocale) : finalTitle);
  const finalUrl = isAbsoluteUrl(localizedPath) ? localizedPath : `${baseUrl}${localizedPath}`;
  const pageGraph = jsonLd ? toJsonLdGraph(jsonLd) : null;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {/* index/noindex según la tabla de rutas por idioma (seo-routes.ts) */}
      <meta name="robots" content={getRobotsForPath(location.pathname)} />

      {/* Canonical absoluta y autorreferente; las rutas fuera de la tabla (404) no llevan. */}
      {seoRoute && <link rel="canonical" href={finalUrl} />}
      {alternateLinks.map((link) => (
        <link key={link.hrefLang} rel="alternate" hrefLang={link.hrefLang} href={link.href} />
      ))}
      {hreflangLocales.includes(fallbackLanguage) && (
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${buildLocalizedPath(pathWithoutLocale, fallbackLanguage)}`} />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      {seoRoute && <meta property="og:url" content={finalUrl} />}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      {emitImageSize && <meta property="og:image:width" content={String(DEFAULT_OG_IMAGE.width)} />}
      {emitImageSize && <meta property="og:image:height" content={String(DEFAULT_OG_IMAGE.height)} />}
      {emitImageSize && <meta property="og:image:type" content={DEFAULT_OG_IMAGE.type} />}
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={localeMeta.ogLocale} />

      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_SITE} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalImageAlt} />

      {/* Nodos de la página (src/lib/jsonld.ts); el prerender los junta con el grafo global. */}
      {pageGraph && pageGraph['@graph'].length > 0 && (
        <script type="application/ld+json">{serializeJsonLd(pageGraph)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
