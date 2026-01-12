import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    allowedHosts: [
      'localhost',
      '.localhost', // Allows *.localhost
      '.layemart.com' // Allows *.layemart.com
    ]
    },
  plugins: [react()],
})
