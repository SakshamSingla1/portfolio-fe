import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-icons')) return 'vendor-icons';
          if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('react-jss') || id.includes('/jss')) return 'vendor-jss';
          if (id.includes('@tanstack')) return 'vendor-query';
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler/')
          ) return 'vendor-react';
          return 'vendor-misc';
        },
      },
    },
  },
})
