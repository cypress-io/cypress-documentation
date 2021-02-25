
export default {
  router: {
    trailingSlash: false,
    extendRoutes(routes, resolve) {
      routes.push(
        {
          path: '/',
          redirect: '/guides/overview/why-cypress',
        },
        {
          path: '/guides',
          redirect: '/guides/overview/why-cypress',
        },
        {
          path: '/plugins',
          redirect: '/plugins/directory',
        },
        {
          path: '/guides/dashboard/dashboard-introduction',
          redirect: '/guides/dashboard/introduction',
        }
      )
    },
  },
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['@/plugins/vue-scrollactive'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/tailwindcss-module
    '@nuxtjs/tailwindcss',
    // Doc: https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css',
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    loadingScreen: process.env.NODE_ENV === 'development',
  },
  /*
   ** Font Awesome Configuration
   */
  fontawesome: {
    icons: {
      solid: [
        'faAngleRight',
        'faBug',
        'faCheckCircle',
        'faCheckSquare',
        'faCode',
        'faCog',
        'faDownload',
        'faExclamationTriangle',
        'faGlobe',
        'faGraduationCap',
        'faHeart',
        'faMagic',
        'faMousePointer',
        'faPlayCircle',
        'faSearch',
        'faSyncAlt',
        'faTerminal',
        'faQuestionCircle',
        'faImage',
        'faVideo',
        'faChevronLeft',
        'faChevronRight',
        'faFileCode',
        'faHistory',
        'faBan',
        'faLongArrowAltUp',
      ],
      brands: ['faGithub', 'faTwitter', 'faYoutube'],
    },
  },
}
