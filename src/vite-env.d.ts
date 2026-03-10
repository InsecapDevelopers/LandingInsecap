/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

interface ImportMetaEnv {
  readonly VITE_TMS_API_URL: string;
  readonly VITE_ECOMMERCE_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
