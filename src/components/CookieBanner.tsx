import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { isAppLanguage } from '@/lib/locale-routing';

/**
 * Banner de cookies con bloqueo previo (Ley 21.719, req #12). GTM, Google Ads, Meta Pixel y Clarity no
 * se cargan hasta "Aceptar" (ver el cargador de index.html). La decisión se guarda en localStorage y se
 * registra, anónima, en el TMS (POST api/publica/consentimiento-cookies). El footer lo reabre con el
 * evento `insecap:cookies`. Si cambia el texto o los terceros, subir VERSION para volver a preguntar.
 */
const VERSION = '2026-11';
const CLAVE = 'insecap-cookies';
const API = (import.meta.env.VITE_TMS_PLUS_API_URL ?? '').replace(/\/+$/, '');

type Guardado = { d: 'aceptadas' | 'rechazadas'; v: string; id: string };

declare global {
  interface Window {
    /** Cargador de terceros de index.html; no hace nada sin consentimiento. */
    __cookies3p?: () => void;
  }
}

const leer = (): Guardado | null => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? 'null');
  } catch {
    return null;
  }
};

const CookieBanner = () => {
  const { t, i18n } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const [visible, setVisible] = useState(false);

  // Solo en el cliente: el HTML prerenderizado nunca trae el banner (sin desajuste de hidratación).
  useEffect(() => {
    setVisible(leer()?.v !== VERSION);
    const abrir = () => setVisible(true);
    window.addEventListener('insecap:cookies', abrir);
    return () => window.removeEventListener('insecap:cookies', abrir);
  }, []);

  const decidir = (d: Guardado['d']) => {
    const antes = leer();
    const g: Guardado = { d, v: VERSION, id: antes?.id ?? crypto.randomUUID() };
    try {
      localStorage.setItem(CLAVE, JSON.stringify(g));
    } catch {
      /* modo privado: se vuelve a preguntar en la próxima visita */
    }
    const idioma = isAppLanguage(i18n.language) ? i18n.language : 'es';
    void fetch(`${API}/api/publica/consentimiento-cookies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idNavegador: g.id, decision: d, version: VERSION, idioma }),
      keepalive: true,
    }).catch(() => undefined);
    setVisible(false);
    if (d === 'aceptadas') window.__cookies3p?.();
    // Retirar el consentimiento: los scripts ya cargados no se pueden descargar, se recarga sin ellos.
    else if (antes?.d === 'aceptadas') window.location.reload();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookies.title')}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm text-gray-700">
          {t('cookies.text')}{' '}
          <a href={localizedPath('/politica-de-privacidad')} className="font-medium text-[#485CC7] underline underline-offset-2">
            {t('cookies.more')}
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => decidir('rechazadas')}>{t('cookies.reject')}</Button>
          <Button onClick={() => decidir('aceptadas')}>{t('cookies.accept')}</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
