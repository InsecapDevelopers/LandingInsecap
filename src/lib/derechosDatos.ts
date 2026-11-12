/**
 * Solicitud de ejercicio de derechos sobre datos personales (Ley 21.719, requerimiento #4).
 * Esquema, validación y armado del multipart que va a POST api/publica/derechos-datos del TMS Plus.
 * Contrato del endpoint: docs/ley21719-contrato-derechos-datos.md. Prueba: derechosDatos.check.ts.
 * Sin React ni window: lo usan la página y el check de node.
 */

export const DERECHOS = ['acceso', 'rectificacion', 'supresion', 'oposicion', 'portabilidad', 'bloqueo'] as const;
export type Derecho = (typeof DERECHOS)[number];

export const ENDPOINT_DERECHOS_DATOS = '/api/publica/derechos-datos';
export const CORREO_PRIVACIDAD = 'privacidad@insecap.cl';

export const LIMITES = {
  nombre: 150,
  correo: 254,
  descripcionMin: 10,
  descripcion: 2000,
  adjuntoBytes: 5 * 1024 * 1024,
  /** Tiempo mínimo de llenado (anti-spam): un humano no completa el formulario en menos. */
  tiempoMinimoMs: 4000,
} as const;

export const ADJUNTO_EXTENSIONES = ['.pdf', '.jpg', '.jpeg', '.png'] as const;
export const ADJUNTO_TIPOS = ['application/pdf', 'image/jpeg', 'image/png'] as const;

export interface AdjuntoLike {
  name: string;
  size: number;
  type: string;
}

export interface SolicitudDerechos {
  derechos: Derecho[];
  nombreCompleto: string;
  run: string;
  correo: string;
  telefono: string;
  esRepresentante: boolean;
  nombreRepresentante: string;
  descripcion: string;
  adjunto: AdjuntoLike | null;
  aceptaPolitica: boolean;
}

export type CampoSolicitud = keyof SolicitudDerechos;

/** Código de error por campo; la página lo traduce. */
export type ErrorCodigo = 'requerido' | 'invalido' | 'largo' | 'corto' | 'tipoArchivo' | 'pesoArchivo';
export type ErroresSolicitud = Partial<Record<CampoSolicitud, ErrorCodigo>>;

/** Orden de los campos en pantalla: el foco va al primero con error. */
export const ORDEN_CAMPOS: CampoSolicitud[] = [
  'derechos', 'nombreCompleto', 'run', 'correo', 'telefono', 'esRepresentante',
  'nombreRepresentante', 'descripcion', 'adjunto', 'aceptaPolitica',
];

/** Quita puntos, guion y espacios; deja el dígito verificador en mayúscula. */
export const limpiarRun = (run: string) => run.replace(/[^0-9kK]/g, '').toUpperCase();

/** Dígito verificador (módulo 11) del cuerpo numérico de un RUN. */
export const calcularDv = (cuerpo: string): string => {
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  return resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
};

/** RUN chileno válido: cuerpo de 6 a 8 dígitos y dígito verificador correcto (con o sin puntos y guion). */
export const esRunValido = (run: string): boolean => {
  const limpio = limpiarRun(run);
  if (!/^\d{6,8}[0-9K]$/.test(limpio)) return false;
  const cuerpo = limpio.slice(0, -1);
  if (/^0/.test(cuerpo)) return false;
  return calcularDv(cuerpo) === limpio.slice(-1);
};

/** Formato normalizado que viaja al backend: cuerpo sin puntos, guion y DV (ej. 11111111-1). */
export const normalizarRun = (run: string) => {
  const limpio = limpiarRun(run);
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`;
};

const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO_RE = /^\+?[0-9 ()-]{8,20}$/;

const extension = (nombre: string) => {
  const i = nombre.lastIndexOf('.');
  return i >= 0 ? nombre.slice(i).toLowerCase() : '';
};

export const validarAdjunto = (adjunto: AdjuntoLike | null): ErrorCodigo | undefined => {
  if (!adjunto) return undefined;
  const ext = extension(adjunto.name);
  const extOk = (ADJUNTO_EXTENSIONES as readonly string[]).includes(ext);
  // Algunos navegadores entregan type vacío: entonces manda la extensión.
  const tipoOk = !adjunto.type || (ADJUNTO_TIPOS as readonly string[]).includes(adjunto.type);
  if (!extOk || !tipoOk) return 'tipoArchivo';
  if (adjunto.size <= 0 || adjunto.size > LIMITES.adjuntoBytes) return 'pesoArchivo';
  return undefined;
};

export const validarSolicitud = (s: SolicitudDerechos): ErroresSolicitud => {
  const e: ErroresSolicitud = {};
  const nombre = s.nombreCompleto.trim();
  const correo = s.correo.trim();
  const telefono = s.telefono.trim();
  const representante = s.nombreRepresentante.trim();
  const descripcion = s.descripcion.trim();

  if (s.derechos.length === 0) e.derechos = 'requerido';
  else if (s.derechos.some((d) => !(DERECHOS as readonly string[]).includes(d))) e.derechos = 'invalido';

  if (!nombre) e.nombreCompleto = 'requerido';
  else if (nombre.length > LIMITES.nombre) e.nombreCompleto = 'largo';

  if (!s.run.trim()) e.run = 'requerido';
  else if (!esRunValido(s.run)) e.run = 'invalido';

  if (!correo) e.correo = 'requerido';
  else if (correo.length > LIMITES.correo || !CORREO_RE.test(correo)) e.correo = 'invalido';

  if (telefono && !TELEFONO_RE.test(telefono)) e.telefono = 'invalido';

  if (s.esRepresentante) {
    if (!representante) e.nombreRepresentante = 'requerido';
    else if (representante.length > LIMITES.nombre) e.nombreRepresentante = 'largo';
  }

  if (!descripcion) e.descripcion = 'requerido';
  else if (descripcion.length < LIMITES.descripcionMin) e.descripcion = 'corto';
  else if (descripcion.length > LIMITES.descripcion) e.descripcion = 'largo';

  const adjunto = validarAdjunto(s.adjunto);
  if (adjunto) e.adjunto = adjunto;

  if (!s.aceptaPolitica) e.aceptaPolitica = 'requerido';

  return e;
};

/** Pares clave/valor del multipart, en el orden del contrato. El adjunto se agrega aparte. */
export const camposFormulario = (
  s: SolicitudDerechos,
  meta: { idioma: string; sitioWeb: string; tiempoLlenadoMs: number },
): Array<[string, string]> => {
  const campos: Array<[string, string]> = s.derechos.map((d, i) => [`Derechos[${i}]`, d]);
  campos.push(['NombreCompleto', s.nombreCompleto.trim()]);
  campos.push(['Run', normalizarRun(s.run)]);
  campos.push(['Correo', s.correo.trim()]);
  if (s.telefono.trim()) campos.push(['Telefono', s.telefono.trim()]);
  campos.push(['EsRepresentante', String(s.esRepresentante)]);
  if (s.esRepresentante) campos.push(['NombreRepresentante', s.nombreRepresentante.trim()]);
  campos.push(['Descripcion', s.descripcion.trim()]);
  campos.push(['AceptaPolitica', String(s.aceptaPolitica)]);
  campos.push(['Idioma', meta.idioma]);
  // Anti-spam: el backend también descarta si SitioWeb trae algo o el tiempo es muy corto.
  campos.push(['SitioWeb', meta.sitioWeb]);
  campos.push(['TiempoLlenadoMs', String(Math.max(0, Math.round(meta.tiempoLlenadoMs)))]);
  return campos;
};
