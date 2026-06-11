// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/ernitoft/Desktop/Insecap/insecap-capacitaciones/node_modules/vite/dist/node/index.js";
import react from "file:///Users/ernitoft/Desktop/Insecap/insecap-capacitaciones/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/ernitoft/Desktop/Insecap/insecap-capacitaciones";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const tmsTarget = env.TMS_PROXY_TARGET || "https://tms.insecap.cl";
  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
      watch: {
        ignored: ["**/.env", "**/.env.local", "**/.env.*"]
      },
      proxy: {
        "/api": {
          target: tmsTarget,
          changeOrigin: true,
          secure: tmsTarget.startsWith("https"),
          headers: { "ngrok-skip-browser-warning": "true" }
        }
      }
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZXJuaXRvZnQvRGVza3RvcC9JbnNlY2FwL2luc2VjYXAtY2FwYWNpdGFjaW9uZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9lcm5pdG9mdC9EZXNrdG9wL0luc2VjYXAvaW5zZWNhcC1jYXBhY2l0YWNpb25lcy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZXJuaXRvZnQvRGVza3RvcC9JbnNlY2FwL2luc2VjYXAtY2FwYWNpdGFjaW9uZXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG4vLyBpbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gIGNvbnN0IHRtc1RhcmdldCA9IGVudi5UTVNfUFJPWFlfVEFSR0VUIHx8ICdodHRwczovL3Rtcy5pbnNlY2FwLmNsJztcblxuICByZXR1cm4ge1xuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogXCI6OlwiLFxuICAgICAgcG9ydDogODA4MCxcbiAgICAgIGFsbG93ZWRIb3N0czogdHJ1ZSxcbiAgICAgIHdhdGNoOiB7XG4gICAgICAgIGlnbm9yZWQ6IFsnKiovLmVudicsICcqKi8uZW52LmxvY2FsJywgJyoqLy5lbnYuKiddLFxuICAgICAgfSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogdG1zVGFyZ2V0LFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IHRtc1RhcmdldC5zdGFydHNXaXRoKCdodHRwcycpLFxuICAgICAgICAgIGhlYWRlcnM6IHsgJ25ncm9rLXNraXAtYnJvd3Nlci13YXJuaW5nJzogJ3RydWUnIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW3JlYWN0KCldLmZpbHRlcihCb29sZWFuKSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVixTQUFTLGNBQWMsZUFBZTtBQUMxWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxRQUFNLFlBQVksSUFBSSxvQkFBb0I7QUFFMUMsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsT0FBTztBQUFBLFFBQ0wsU0FBUyxDQUFDLFdBQVcsaUJBQWlCLFdBQVc7QUFBQSxNQUNuRDtBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUSxVQUFVLFdBQVcsT0FBTztBQUFBLFVBQ3BDLFNBQVMsRUFBRSw4QkFBOEIsT0FBTztBQUFBLFFBQ2xEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUNqQyxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
