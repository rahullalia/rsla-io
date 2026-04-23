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
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          gsap: ['gsap'],
          sanity: ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
          router: ['react-router-dom'],
          motion: ['motion', 'motion/react'],
          sentry: ['@sentry/react'],
        },
      },
    },
  },
})
