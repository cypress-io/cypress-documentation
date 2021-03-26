import { getMetaData } from './utils/getMetaData'
import { redirects } from './redirects'

const meta = getMetaData()

export default {
  router: {
    trailingSlash: undefined,
    extendRoutes(routes, resolve) {
      routes.push(...redirects)
    },
  },
  generate: {
    routes: ['404'],
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
    htmlAttrs: {
      lang: 'en',
    },
    title: 'Cypress Documentation',
    meta: [
      ...meta,
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: '/js/removeTrailingSlash.js' }],
  },
  /*
   ** Global CSS
   */
  css: ['@docsearch/css'],
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
  buildModules: ['@nuxtjs/tailwindcss', '@nuxtjs/fontawesome', '@nuxt/image'],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxt/content', '@nuxtjs/gtm'],
  /*
   ** Google Tag Manager
   */
  gtm: {
    // The env var CONTEXT is set by Netlify and can be 'production', 'deploy-preview', or 'branch-deploy'
    id:
      (process.env.CONTEXT === 'production' && 'GTM-KNKBWLD') || 'GTM-XXXXXXX',
  },
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
        'faCheck',
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
        'faFolderOpen',
        'faStar',
      ],
      brands: ['faGithub', 'faTwitter', 'faYoutube'],
    },
  },
}
