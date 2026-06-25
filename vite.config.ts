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
          if (id.includes('@tanstack')) return 'vendor-query';
          // React + all libs that call React.createContext at module eval time
          // (react-jss, react-helmet-async, etc.) must stay together in one
          // chunk so React is guaranteed to be initialized before they run.
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/scheduler/') ||
            id.includes('react-jss') ||
            id.includes('/jss') ||
            id.includes('react-helmet') ||
            id.includes('axios')
          ) return 'vendor-react';
        },
      },
    },
  },
})
