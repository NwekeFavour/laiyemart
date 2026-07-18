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
      includeAssets: [
        'icons/apple-touch-icon.png',
        'icons/favicon-96x96.png',
        'icons/layemart-icon.ico',
      ],
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
          { src: '/icons/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
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
