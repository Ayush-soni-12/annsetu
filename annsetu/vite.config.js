import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['recharts'],
  },
  server: {
    proxy: {
      // All /api requests from the browser are forwarded to the Express backend.
      // This makes frontend + backend appear on the same origin → no CORS needed.
      '/api': {
        target: 'https://api.annsetu.online',        changeOrigin: true,
        secure: false,
      },
    },
  },
})
