import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/layemart-icon.jpg'],
      manifest: {
        name: 'LayeMart',
        short_name: 'LayeMart',
        description: 'LayeMart: The premier commerce engine for modern storefronts.',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html'
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    })
  ]
})
