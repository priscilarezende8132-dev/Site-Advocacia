import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['gray-matter']
  },
  server: {
    fs: {
      // Permite servir arquivos de fora da raiz
      allow: ['..']
    }
  }
})