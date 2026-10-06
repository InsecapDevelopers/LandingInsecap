import { useLocation } from 'react-router-dom';

import { buildLocalizedPath, getLocaleFromPath } from '@/lib/locale-routing';
import { fallbackLanguage, type AppLanguage } from '@/lib/translations';

/** El idioma sale de la URL (/es, /en, /pt): igual en el servidor y en el cliente, sin desfase al hidratar. */
export const useLocalizedPath = () => {
  const { pathname } = useLocation();
  const locale: AppLanguage = getLocaleFromPath(pathname) ?? fallbackLanguage;

  return {
    locale,
    localizedPath: (pathname: string) => buildLocalizedPath(pathname, locale),
  };
};
