import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const tmsPlusTarget = env.TMS_PLUS_PROXY_TARGET || 'https://api-plus.insecap.cl';
  // Capin (RAG-service) local: la burbuja llama a /capin/chat y el proxy evita CORS en dev.
  const capinTarget = env.CAPIN_PROXY_TARGET || 'http://localhost:8000';
  // Fecha del build en hora de Chile (AAAA-MM-DD). Fija el "hoy" de los filtros por fecha
  // (openCourses.ts) para que el HTML prerenderizado y la hidratación coincidan; el cron diario
  // del deploy la renueva. BUILD_DATE permite fijarla a mano. En dev no se define: usa new Date().
  const buildDate = env.BUILD_DATE
    || new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(new Date());

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
      watch: {
        ignored: ['**/.env', '**/.env.local', '**/.env.*'],
      },
      proxy: {
        '/capin': {
          target: capinTarget,
          changeOrigin: true,
          secure: capinTarget.startsWith('https'),
          rewrite: (p) => p.replace(/^\/capin/, ''),
        },
        // Todo /api va al TMS Plus (contacto, noticias, Trabaja con nosotros, comercial de turno,
        // muro). El sitio ya no consume el TMS Legacy.
        '/api': {
          target: tmsPlusTarget,
          changeOrigin: true,
          secure: tmsPlusTarget.startsWith('https'),
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
      },
    },
    plugins: [react()].filter(Boolean),
    define: command === 'build' ? { __BUILD_DATE__: JSON.stringify(buildDate) } : {},
    // Build SSR del prerender (src/entry-server.tsx): react-helmet-async es CJS con exports que
    // Node no resuelve como ESM; se empaqueta en vez de quedar externo.
    ssr: {
      noExternal: ['react-helmet-async'],
    },
    // Fase 6: ES2020 (sin transpilar a sintaxis vieja). Es el mismo piso que exigen los módulos ES.
    build: {
      target: 'es2020',
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
