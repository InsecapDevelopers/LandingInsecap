import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const tmsTarget = env.TMS_PROXY_TARGET || 'https://tms.insecap.cl';

  console.log('[vite.config] TMS_PROXY_TARGET:', env.TMS_PROXY_TARGET);
  console.log('[vite.config] proxy target final:', tmsTarget);


  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: "all",
      proxy: {
        '/api': {
          target: tmsTarget,
          changeOrigin: true,
          secure: tmsTarget.startsWith('https'),
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
