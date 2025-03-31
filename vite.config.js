import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ 경로 단축용 alias
    },
  },
  server: {
    host: "localhost",
    port: 5173,
    proxy: {
      // ✅ /user 요청 백엔드로 프록시
      "/user": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false, // 쿠키/세션 사용 시 필수
        rewrite: (path) => path.replace(/^\/user/, "/user"),
      },
      // ✅ /api 요청 백엔드로 프록시
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
        secure: false, // 쿠키/세션 사용 시 필수
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  plugins: [react()],
});
