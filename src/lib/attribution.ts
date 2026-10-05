// Origen publicitario de la visita (gclid / utm). Se guarda al entrar y viaja con el formulario de
// contacto como `atribucion`, para que el TMS sepa qué contactos vienen de cada campaña.
// Último clic gana; dura 90 días, igual que la ventana de conversión de Google Ads.

const STORAGE_KEY = 'insecap_atribucion';
const TTL_DAYS = 90;

// Campo del payload → parámetro de la URL
const URL_PARAMS = {
  gclid: 'gclid',
  gbraid: 'gbraid',
  wbraid: 'wbraid',
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmTerm: 'utm_term',
  utmContent: 'utm_content',
} as const;

type ParamKey = keyof typeof URL_PARAMS;

export type Attribution = Record<ParamKey, string | null> & {
  landingPage: string;
  referrer: string | null;
  primeraVisita: string;
  expira: string;
};

export type AttributionPayload = Omit<Attribution, 'expira'>;

const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');

/** ISO 8601 en hora local con zona, ej. 2026-10-05T09:12:44-03:00 */
export const isoWithOffset = (d: Date) => {
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

const isExpired = (a: Attribution, now: Date) => !(new Date(a.expira).getTime() > now.getTime());

/**
 * Registro a guardar después de una carga de página, o null para borrar / no guardar nada.
 * Función pura: toda la lectura del navegador queda en trackAttribution.
 */
export const nextAttribution = (
  stored: Attribution | null,
  search: string,
  pathname: string,
  referrer: string,
  siteHost: string,
  now: Date,
): Attribution | null => {
  const current = stored && !isExpired(stored, now) ? stored : null;
  const query = new URLSearchParams(search);
  const params = Object.fromEntries(
    Object.entries(URL_PARAMS).map(([key, param]) => [key, query.get(param) || null]),
  ) as Record<ParamKey, string | null>;
  const hasParams = Object.values(params).some(Boolean);
  const externalReferrer = referrer && hostOf(referrer) !== siteHost.replace(/^www\./, '') ? referrer : null;

  // Sin parámetros: un registro vigente se respeta (el clic pagado no lo pisa una visita orgánica).
  if (!hasParams && current) return current;
  // Directo o navegación interna sin registro previo: nada que guardar.
  if (!hasParams && !externalReferrer) return null;

  return {
    ...params,
    landingPage: pathname,
    referrer: externalReferrer,
    primeraVisita: isoWithOffset(now),
    expira: new Date(now.getTime() + TTL_DAYS * 86_400_000).toISOString(),
  };
};

const clip = (v: string | null, max: number) => (v ? v.slice(0, max) : null);

/** Lo que se envía al TMS: sin `expira` y recortado a los largos que acepta el backend. */
export const toPayload = (a: Attribution): AttributionPayload => ({
  gclid: clip(a.gclid, 255),
  gbraid: clip(a.gbraid, 255),
  wbraid: clip(a.wbraid, 255),
  utmSource: clip(a.utmSource, 255),
  utmMedium: clip(a.utmMedium, 255),
  utmCampaign: clip(a.utmCampaign, 255),
  utmTerm: clip(a.utmTerm, 255),
  utmContent: clip(a.utmContent, 255),
  landingPage: clip(a.landingPage, 1000) ?? '',
  referrer: clip(a.referrer, 1000),
  primeraVisita: a.primeraVisita,
});

const read = (): Attribution | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
};

/** Llamar en cada carga de página o navegación del router. Nunca lanza. */
export const trackAttribution = (search: string, pathname: string) => {
  try {
    const stored = read();
    const next = nextAttribution(stored, search, pathname, document.referrer, location.hostname, new Date());
    if (!next) localStorage.removeItem(STORAGE_KEY);
    else if (next !== stored) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage bloqueado (modo privado, políticas): el sitio sigue sin atribución.
  }
};

/** `atribucion` para el POST /api/contacto, o null si no hay registro vigente. Nunca lanza. */
export const getAttributionPayload = (): AttributionPayload | null => {
  try {
    const stored = read();
    if (!stored) return null;
    if (isExpired(stored, new Date())) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return toPayload(stored);
  } catch {
    return null;
  }
};
