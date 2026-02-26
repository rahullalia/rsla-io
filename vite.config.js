import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      // Exclude sanity.config.ts (only used for CLI schema deploy, not the website)
      external: [],
      output: {
        manualChunks: {
          gsap: ['gsap', '@gsap/react'],
          sanity: ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
          router: ['react-router-dom'],
          motion: ['motion'],
        },
      },
    },
  },
})
