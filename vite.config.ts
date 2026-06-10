import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const tmsTarget = env.TMS_PROXY_TARGET || 'https://localhost:44362';

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
      watch: {
        // Ignorar cambios en .env* para evitar reinicios espurios (causados por extensiones externas)
        ignored: ['**/.env', '**/.env.local', '**/.env.*'],
      },
      // proxy: {
      //   '/api': {
      //     target: tmsTarget,
      //     changeOrigin: true,
      //     secure: tmsTarget.startsWith('https'),
      //     headers: { 'ngrok-skip-browser-warning': 'true' },
      //   },
      // },
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
