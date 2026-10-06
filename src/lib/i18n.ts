import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { fallbackLanguage, resources, supportedLanguages } from './translations';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: fallbackLanguage,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    // La URL (/es, /en, /pt) es la única fuente del idioma; nunca Accept-Language.
    // entry-client y entry-server llaman a changeLanguage(locale del path) antes de renderizar.
    detection: {
      order: ['path', 'localStorage'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
    showSupportNotice: false,
  });

export default i18n;