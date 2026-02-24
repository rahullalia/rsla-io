import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Exclude sanity.config.ts (only used for CLI schema deploy, not the website)
      external: [],
      output: {
        manualChunks: {
          gsap: ['gsap', '@gsap/react'],
          sanity: ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
