import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ 여기가 핵심!
    },
  },
  server: {
    host: "localhost",
    port: 5173,
    proxy: {
      "/auth": {
        target: "http://localhost:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, "/auth"),
      },
      "/user": {
        target: "http://localhost:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user/, "/user"),
      },
    },
  },
  plugins: [react()],
});
