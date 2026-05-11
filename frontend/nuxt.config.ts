import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  ssr: false,

  modules: ['@pinia/nuxt'],

  nitro: {
    preset: 'node-server',
  },

  components: {
    dirs: [
      { path: '~/components', pathPrefix: false },
    ],
  },

  build: {
    transpile: ['vuetify'],
  },

  runtimeConfig: {
    public: {
<<<<<<< HEAD
      apiBase: 'http://localhost:8001/api',
=======
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8001/api',
>>>>>>> f40dbff57e416aca8204ab8dff93aff2d7c2c718
    },
  },

  app: {
    head: {
      title: 'Canchas Sintéticas — Reserva tu cancha y juega como un profesional',
      meta: [
        { name: 'description', content: 'Plataforma de reserva de canchas sintéticas de fútbol. Encuentra y reserva la cancha perfecta para tu partido.' },
        { name: 'theme-color', content: '#0a0e1a' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
<<<<<<< HEAD
        { rel: 'icon', type: 'image/png', href: '/LOGO%20TU%20CANCHA%202.png' },
=======
>>>>>>> f40dbff57e416aca8204ab8dff93aff2d7c2c718
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap',
        },
      ],
    },
  },

  css: ['@mdi/font/css/materialdesignicons.css', '~/assets/main.css'],

  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: '2025-01-01',
})
