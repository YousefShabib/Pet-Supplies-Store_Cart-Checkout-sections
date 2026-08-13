import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        wc: 'src/wc.tsx',
      },
      output: {
        entryFileNames: (chunk) => (chunk.name === 'wc' ? 'wc.js' : 'assets/[name]-[hash].js'),
      },
    },
  },
})
