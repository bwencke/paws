/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import { webcrypto } from 'node:crypto'

if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.getRandomValues !== 'function') {
  globalThis.crypto = webcrypto as Crypto
}

/** Must match the GitHub Pages project path (repo name). */
const GH_PAGES_BASE = '/paws/'

const pwaIcons = [
  { src: 'icons/icon-48.webp', sizes: '48x48', type: 'image/webp', purpose: 'any maskable' },
  { src: 'icons/icon-72.webp', sizes: '72x72', type: 'image/webp', purpose: 'any maskable' },
  { src: 'icons/icon-96.webp', sizes: '96x96', type: 'image/webp', purpose: 'any maskable' },
  { src: 'icons/icon-128.webp', sizes: '128x128', type: 'image/webp', purpose: 'any maskable' },
  { src: 'icons/icon-192.webp', sizes: '192x192', type: 'image/webp', purpose: 'any maskable' },
  { src: 'icons/icon-256.webp', sizes: '256x256', type: 'image/webp', purpose: 'any maskable' },
  { src: 'icons/icon-512.webp', sizes: '512x512', type: 'image/webp', purpose: 'any maskable' },
] as const

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'serve' ? '/' : GH_PAGES_BASE

  return {
    base,
    plugins: [
      {
        name: 'html-base-for-github-pages',
        transformIndexHtml(html) {
          if (base === '/') return html
          return html.replace(/<base href="\/" \/>/, `<base href="${base}" />`)
        },
      },
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'My Ionic App',
          short_name: 'Ionic App',
          description: 'An Ionic project',
          start_url: GH_PAGES_BASE,
          scope: GH_PAGES_BASE,
          display: 'standalone',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          icons: [...pwaIcons],
        },
        workbox: {
          navigateFallback: `${GH_PAGES_BASE}index.html`,
          navigateFallbackDenylist: [/^\/_/, /\.(?:ico|png|webp|svg|woff2?)$/],
        },
      }),
      legacy(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  }
})
