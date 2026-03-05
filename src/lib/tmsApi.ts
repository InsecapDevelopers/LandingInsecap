export interface LiderComercial {
  nombre: string;
  correo: string;
  telefono: string;
  foto: string | null;
}

export interface PodioItem {
  nombre: string;
  rol: string;
  mes: string;
  foto: string | null;
  logro: string;
}

export interface PodioInsecoinsItem {
  puesto: number;
  nombre: string;
  foto: string | null;
  totalInsecoins: number;
}

export interface PodioEstrellasItem {
  puesto: number;
  nombre: string;
  foto: string | null;
  totalEstrellas: number;
}

export interface PodioEstrellas {
  fecha: string;
  ranking: PodioEstrellasItem[];
}

const BASE = import.meta.env.VITE_TMS_API_URL ?? '';

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

export const getMuroFamaPodio = () =>
  tmsGet<PodioItem[]>('/api/MuroFama/podio', []);

export const getPodioInsecoins = () =>
  tmsGet<PodioInsecoinsItem[]>('/api/MuroFelicidad/podioInsecoins', []);

export const getPodioEstrellas = () =>
  tmsGet<PodioEstrellas>('/api/MuroFelicidad/podioEstrellas', { fecha: '', ranking: [] });
