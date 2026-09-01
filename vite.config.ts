import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // jodit-react is a single ~1.1MB third-party bundle we can't split further;
    // it's already lazy-loaded on-demand (never in the initial page load), so
    // the default 500KB/1000KB warning threshold is a known false positive here.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Only split libs with no circular deps / no createContext at eval time
          if (id.includes('react-icons')) return 'vendor-icons';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('@tanstack')) return 'vendor-query';
          if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui';
          if (id.includes('formik') || id.includes('yup')) return 'vendor-forms';
          if (id.includes('axios')) return 'vendor-http';
          if (id.includes('dayjs')) return 'vendor-date';
          if (id.includes('dompurify')) return 'vendor-dompurify';
          if (id.includes('i18next')) return 'vendor-i18n';
          if (id.includes('jss')) return 'vendor-jss';
          if (id.includes('@dnd-kit')) return 'vendor-dnd';
        },
      },
    },
  },
})
