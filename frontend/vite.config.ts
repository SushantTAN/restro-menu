import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate', // keeps SW fresh
    includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'], // your icons
    manifest: {
      name: 'HamroMenu',
      short_name: 'HamroMenu',
      description: 'Your food ordering app',
      start_url: '.',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/logo192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/logo512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})