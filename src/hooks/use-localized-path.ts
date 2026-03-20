import { useTranslation } from 'react-i18next';

import { buildLocalizedPath, isAppLanguage } from '@/lib/locale-routing';
import { fallbackLanguage, type AppLanguage } from '@/lib/translations';

export const useLocalizedPath = () => {
  const { i18n } = useTranslation();
  const resolvedLanguage = i18n.resolvedLanguage;
  const locale: AppLanguage = isAppLanguage(resolvedLanguage) ? resolvedLanguage : fallbackLanguage;

  return {
    locale,
    localizedPath: (pathname: string) => buildLocalizedPath(pathname, locale),
  };
};