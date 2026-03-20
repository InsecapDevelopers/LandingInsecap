import { fallbackLanguage, supportedLanguages, type AppLanguage } from './translations';

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export const isAppLanguage = (value: string | undefined | null): value is AppLanguage => {
  if (!value) {
    return false;
  }

  return supportedLanguages.includes(value as AppLanguage);
};

export const isAbsoluteUrl = (value: string) => ABSOLUTE_URL_PATTERN.test(value);

export const getLocaleFromPath = (pathname: string): AppLanguage | null => {
  const [, firstSegment] = pathname.split('/');
  return isAppLanguage(firstSegment) ? firstSegment : null;
};

export const stripLocaleFromPath = (pathname: string): string => {
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const locale = getLocaleFromPath(normalizedPathname);

  if (!locale) {
    return normalizedPathname || '/';
  }

  const strippedPath = normalizedPathname.slice(locale.length + 1);
  return strippedPath || '/';
};

export const buildLocalizedPath = (pathname: string, locale: AppLanguage = fallbackLanguage): string => {
  if (isAbsoluteUrl(pathname)) {
    return pathname;
  }

  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const strippedPath = stripLocaleFromPath(normalizedPathname);

  return strippedPath === '/' ? `/${locale}` : `/${locale}${strippedPath}`;
};

export const getLocaleMeta = (locale: AppLanguage) => {
  switch (locale) {
    case 'en':
      return { htmlLang: 'en', ogLocale: 'en_US', hreflang: 'en' };
    case 'pt':
      return { htmlLang: 'pt', ogLocale: 'pt_BR', hreflang: 'pt' };
    case 'es':
    default:
      return { htmlLang: 'es', ogLocale: 'es_CL', hreflang: 'es' };
  }
};