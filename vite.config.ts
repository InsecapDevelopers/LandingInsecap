import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const tmsTarget = env.TMS_PROXY_TARGET || 'https://tms.insecap.cl';
  const tmsPlusTarget = env.TMS_PLUS_PROXY_TARGET || 'https://api-plus.insecap.cl';

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
      watch: {
        ignored: ['**/.env', '**/.env.local', '**/.env.*'],
      },
      proxy: {
        // Ruta más específica primero: /api/contacto va al TMS Plus, el resto de /api al TMS.
        '/api/contacto': {
          target: tmsPlusTarget,
          changeOrigin: true,
          secure: tmsPlusTarget.startsWith('https'),
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
        '/api': {
          target: tmsTarget,
          changeOrigin: true,
          secure: tmsTarget.startsWith('https'),
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
      },
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
