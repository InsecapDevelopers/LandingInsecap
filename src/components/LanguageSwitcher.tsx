import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { buildLocalizedPath } from '@/lib/locale-routing';
import { cn } from '@/lib/utils';
import { fallbackLanguage, type AppLanguage, supportedLanguages } from '@/lib/translations';

type LanguageSwitcherProps = {
  className?: string;
};

const FlagIcon = ({ language }: { language: AppLanguage }) => {
  if (language === 'es') {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" aria-hidden="true">
        <clipPath id="flag-es-cl">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
        <g clipPath="url(#flag-es-cl)">
          <rect width="24" height="24" fill="#ffffff" />
          <rect y="12" width="24" height="12" fill="#d52b1e" />
          <rect width="10" height="12" fill="#0039a6" />
          <path d="M5 3.3l1.06 3.24h3.41L6.7 8.55l1.06 3.25L5 9.8 2.24 11.8 3.3 8.55.53 6.54h3.41L5 3.3z" fill="#ffffff" />
        </g>
      </svg>
    );
  }

  if (language === 'en') {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" aria-hidden="true">
        <clipPath id="flag-en-us">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
        <g clipPath="url(#flag-en-us)">
          <rect width="24" height="24" fill="#ffffff" />
          <rect width="24" height="2.4" y="0" fill="#b22234" />
          <rect width="24" height="2.4" y="4.8" fill="#b22234" />
          <rect width="24" height="2.4" y="9.6" fill="#b22234" />
          <rect width="24" height="2.4" y="14.4" fill="#b22234" />
          <rect width="24" height="2.4" y="19.2" fill="#b22234" />
          <rect width="11" height="11" fill="#3c3b6e" />
          <g fill="#ffffff">
            <circle cx="2.2" cy="2.2" r="0.6" />
            <circle cx="5" cy="2.2" r="0.6" />
            <circle cx="7.8" cy="2.2" r="0.6" />
            <circle cx="2.2" cy="5" r="0.6" />
            <circle cx="5" cy="5" r="0.6" />
            <circle cx="7.8" cy="5" r="0.6" />
            <circle cx="2.2" cy="7.8" r="0.6" />
            <circle cx="5" cy="7.8" r="0.6" />
            <circle cx="7.8" cy="7.8" r="0.6" />
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" aria-hidden="true">
      <clipPath id="flag-pt-br">
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath="url(#flag-pt-br)">
        <rect width="24" height="24" fill="#009b3a" />
        <path d="M12 3.2L20.8 12 12 20.8 3.2 12 12 3.2z" fill="#ffdf00" />
        <circle cx="12" cy="12" r="4.2" fill="#002776" />
        <path d="M8.2 11.4c1.2-1 2.53-1.5 3.98-1.5 1.45 0 2.77.5 3.96 1.48" fill="none" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />
      </g>
    </svg>
  );
};

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = (i18n.resolvedLanguage ?? fallbackLanguage) as AppLanguage;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md',
        className,
      )}
      aria-label={t('languageSwitcher.label')}
      role="group"
    >
      {supportedLanguages.map((language) => {
        const isActive = currentLanguage === language;

        return (
          <button
            key={language}
            type="button"
            onClick={() => {
              const nextPath = buildLocalizedPath(location.pathname, language);
              navigate(`${nextPath}${location.search}${location.hash}`);
            }}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
              isActive ? 'bg-white text-slate-900' : 'text-white/75 hover:text-white',
            )}
            aria-pressed={isActive}
            title={t(`languageSwitcher.options.${language}`)}
          >
            <span className="mr-1 inline-flex" aria-hidden="true">
              <FlagIcon language={language} />
            </span>
            {language}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;