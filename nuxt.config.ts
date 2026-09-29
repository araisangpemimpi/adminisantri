// Nuxt 4 — Pesantren Management. Mobile-first SPA + PWA installable (SSR off).
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },

  // Full CSR / SPA: shell + client rendering, cocok untuk app mobile & PWA.
  ssr: false,

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: false,
  },

  routeRules: {
    '/**': { ssr: false, prerender: true },
  },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      // SPA total: hanya shell yang dirender, sisanya ditangani router klien.
      // Fallback 200.html dipakai agar refresh di rute mana pun tetap memuat app.
      fallback: true,
    },
  },

  spaLoadingTemplate: true,

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Pesantren Al-Hikmah',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Pesantren Al-Hikmah — profil, agenda, pengumuman, prestasi, galeri, PSB, dan kontak dalam satu aplikasi mobile.' },
        { name: 'theme-color', content: '#0f766e' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Al-Hikmah' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icons/icon.svg' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Pesantren Al-Hikmah',
      waNumber: process.env.NUXT_PUBLIC_WA_NUMBER || '6281234567890',
    },
  },

  modules: ['@nuxt/ui', '@nuxtjs/supabase', '@vite-pwa/nuxt'],

  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    redirect: false,
    clientOptions: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    includeAssets: ['icons/*.png', 'icons/*.svg', 'favicon.ico'],
    manifest: {
      name: 'Pesantren Al-Hikmah',
      short_name: 'Al-Hikmah',
      description: 'Profil, agenda, pengumuman, prestasi, galeri, PSB, dan kontak pesantren dalam satu aplikasi mobile.',
      theme_color: '#0f766e',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/?source=pwa',
      lang: 'id',
      categories: ['education'],
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      shortcuts: [
        { name: 'Daftar PSB', short_name: 'Daftar', url: '/psb', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        { name: 'Pengumuman', short_name: 'Info', url: '/pengumuman', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        { name: 'Kontak', short_name: 'Kontak', url: '/kontak', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,pdf}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-api',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
            networkTimeoutSeconds: 5,
          },
        },
        {
          urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      // SW menyajikan bundle lama saat dev & memblokir HMR — hanya aktif di build/preview.
      enabled: false,
      type: 'module',
    },
  },
})
