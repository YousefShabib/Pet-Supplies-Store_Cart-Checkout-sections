import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 4174,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
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
