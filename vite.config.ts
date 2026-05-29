import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '');
  // const tmsTarget = env.TMS_PROXY_TARGET || 'https://tms.insecap.cl';
  // Proxy TMS deshabilitado — los endpoints /api/LiderComercial y /api/Podio no están en uso.
  // Para reactivarlo: descomentar las líneas anteriores y el bloque proxy abajo.

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
      // proxy: {
      //   '/api': {
      //     target: tmsTarget,
      //     changeOrigin: true,
      //     secure: tmsTarget.startsWith('https'),
      //     headers: { 'ngrok-skip-browser-warning': 'true' },
      //   },
      // },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
