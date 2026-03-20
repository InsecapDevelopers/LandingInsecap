import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { buildLocalizedPath, getLocaleFromPath, getLocaleMeta, isAbsoluteUrl, stripLocaleFromPath } from '@/lib/locale-routing';
import { fallbackLanguage, supportedLanguages } from '@/lib/translations';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  keywords?: string[];
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SEO = ({
  title,
  description,
  image,
  imageAlt,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  keywords = [],
  article,
  jsonLd,
}: SEOProps) => {
  const location = useLocation();

  // Default values
  const siteName = 'INSECAP - Capacitaciones';
  const defaultTitle = 'INSECAP - Organismo Técnico de Capacitación';
  const defaultDescription = 'INSECAP es un Organismo Técnico de Capacitación (OTEC) certificado, especializado en formación profesional y desarrollo de competencias laborales en Chile.';
  const defaultImage = 'https://storage.googleapis.com/gpt-engineer-file-uploads/gakLUeb1NqeODjO4gfzigCGfMjb2/social-images/social-1767794256256-Insecap_ISOTIPO-08.png';
  const baseUrl = 'https://insecap-capacitaciones.myshopify.com';
  const currentLocale = getLocaleFromPath(location.pathname) ?? fallbackLanguage;
  const localeMeta = getLocaleMeta(currentLocale);
  const sourcePath = url && !isAbsoluteUrl(url) ? url : location.pathname;
  const localizedPath = url
    ? (isAbsoluteUrl(url) ? url : buildLocalizedPath(sourcePath, currentLocale))
    : location.pathname;
  const pathWithoutLocale = stripLocaleFromPath(sourcePath);
  const alternateLinks = supportedLanguages.map((language) => {
    const meta = getLocaleMeta(language);
    return {
      hrefLang: meta.hreflang,
      href: `${baseUrl}${buildLocalizedPath(pathWithoutLocale, language)}`,
    };
  });

  // Computed values
  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalImageAlt = imageAlt || title || 'INSECAP';
  const finalUrl = isAbsoluteUrl(localizedPath) ? localizedPath : `${baseUrl}${localizedPath}`;
  const finalKeywords = keywords.length > 0 
    ? keywords.join(', ') 
    : 'capacitación, OTEC, formación profesional, desarrollo laboral, cursos, Chile, INSECAP';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />
      {alternateLinks.map((link) => (
        <link key={link.hrefLang} rel="alternate" hrefLang={link.hrefLang} href={link.href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${buildLocalizedPath(pathWithoutLocale, fallbackLanguage)}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={localeMeta.ogLocale} />

      {/* Article specific tags */}
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
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
      <meta property="inLanguage" content={localeMeta.htmlLang} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured Data / JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
