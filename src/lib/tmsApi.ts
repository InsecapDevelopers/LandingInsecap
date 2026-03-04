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

export const getLiderComercial = () =>
  tmsGet<LiderComercial | null>('/api/LiderComercial/actual', null);

export const getMuroFamaPodio = () =>
  tmsGet<PodioItem[]>('/api/MuroFama/podio', []);

export const getPodioInsecoins = () =>
  tmsGet<PodioInsecoinsItem[]>('/api/MuroFelicidad/podioInsecoins', []);

export const getPodioEstrellas = () =>
  tmsGet<PodioEstrellas>('/api/MuroFelicidad/podioEstrellas', { fecha: '', ranking: [] });
