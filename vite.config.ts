import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor'
            if (id.includes('/react/')) return 'react-vendor'
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('@mui') || id.includes('@emotion')) return 'mui'
            if (id.includes('react-icons') || id.includes('lucide-react')) return 'icons'
            if (id.includes('formik') || id.includes('/yup/')) return 'forms'
            if (id.includes('@tanstack')) return 'query'
            if (id.includes('@dnd-kit')) return 'dnd'
            if (id.includes('react-globe') || id.includes('globe.gl') || id.includes('three')) return 'globe'
            if (id.includes('tsparticles') || id.includes('react-tsparticles')) return 'particles'
            if (id.includes('jodit')) return 'editor'
            if (id.includes('axios') || id.includes('dayjs') || id.includes('moment') || id.includes('dompurify')) return 'utils'
            return 'vendor'
          }
        },
      },
    },
  },
})
