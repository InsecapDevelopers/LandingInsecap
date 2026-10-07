export interface LiderComercial {
  nombre: string;
  correo: string;
  telefono: string;
  foto: string | null;
}

/** Ganador vigente del Muro de la Fama (TMS Plus: /api/public/muro/fama/podio). */
export interface GanadorFama {
  categoria: 'trabajador' | 'relator';
  nombre: string;
  mes: number;
  anio: number;
  foto: string | null;
}

export interface PodioInsecoinsItem {
  puesto: number;
  nombre: string;
  foto: string | null;
  totalInsecoins: number;
}

// Endpoints públicos del TMS Plus (antes en el TMS Legacy, tms.insecap.cl).
const BASE = (import.meta.env.VITE_TMS_PLUS_API_URL ?? '').replace(/\/+$/, '');
// El TMS Plus devuelve la foto como ruta relativa a su API (redirige a Spaces).
const absoluta = (url: string | null | undefined) => (url ? (url.startsWith('/') ? `${BASE}${url}` : url) : null);

async function tmsGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`);
    const ct = res.headers.get('content-type') ?? '';
    if (!res.ok || !ct.includes('json')) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

// ── Caché en memoria + sessionStorage (TTL 5 minutos) ──────────────────────
const LIDER_CACHE_KEY = 'insecap_lider_comercial';
const LIDER_CACHE_TTL = 5 * 60 * 1000; // 5 min en ms

interface LiderCache { data: LiderComercial | null; ts: number; }

let _liderMemory: LiderCache | null = null;

export const getLiderComercial = async (): Promise<LiderComercial | null> => {
  const now = Date.now();

  // 1. Memoria (más rápido)
  if (_liderMemory && now - _liderMemory.ts < LIDER_CACHE_TTL) {
    return _liderMemory.data;
  }

  // 2. sessionStorage (persiste entre montajes de componentes)
  try {
    const raw = sessionStorage.getItem(LIDER_CACHE_KEY);
    if (raw) {
      const cached: LiderCache = JSON.parse(raw);
      if (now - cached.ts < LIDER_CACHE_TTL) {
        _liderMemory = cached;
        return cached.data;
      }
    }
  } catch { /* sessionStorage puede fallar en SSR o modo privado */ }

  // 3. Fetch real
  const data = await tmsGet<LiderComercial | null>('/api/LiderComercial/actual', null);
  const entry: LiderCache = { data, ts: now };
  _liderMemory = entry;
  try { sessionStorage.setItem(LIDER_CACHE_KEY, JSON.stringify(entry)); } catch { }
  return data;
};

interface PodioPublico { posicion: number; nombreCompleto: string; total: number; fotoUrl: string | null }

export const getPodioInsecoins = async (): Promise<PodioInsecoinsItem[]> =>
  (await tmsGet<PodioPublico[]>('/api/public/muro/felicidad/podio-insecoins', [])).map((p) => ({
    puesto: p.posicion,
    nombre: p.nombreCompleto,
    foto: absoluta(p.fotoUrl),
    totalInsecoins: p.total,
  }));

interface FamaPublico { categoria: GanadorFama['categoria']; nombreCompleto: string; mes: number; anio: number; fotoUrl: string | null }

export const getGanadoresFama = async (): Promise<GanadorFama[]> =>
  (await tmsGet<FamaPublico[]>('/api/public/muro/fama/podio', [])).map((g) => ({
    categoria: g.categoria,
    nombre: g.nombreCompleto,
    mes: g.mes,
    anio: g.anio,
    foto: absoluta(g.fotoUrl),
  }));
