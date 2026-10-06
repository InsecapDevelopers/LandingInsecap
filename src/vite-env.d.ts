/// <reference types="vite/client" />

/** Fecha del build (AAAA-MM-DD, hora de Chile). Solo existe en `vite build` (vite.config.ts). */
declare const __BUILD_DATE__: string | undefined;

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

interface ImportMetaEnv {
  readonly VITE_TMS_API_URL: string;
  readonly VITE_TMS_PLUS_API_URL: string;
  readonly VITE_ECOMMERCE_ENABLED: string;
  readonly VITE_LECTURA_JSON: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
