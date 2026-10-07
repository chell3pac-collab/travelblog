import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy уже настроен на мок-сервер (http://127.0.0.1:8000).
// Если у вас настоящий бэкенд на другом адресе — поменяйте target.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://127.0.0.1:8000", changeOrigin: true },
      "/images": { target: "http://127.0.0.1:8000", changeOrigin: true },
    },
  },
});
