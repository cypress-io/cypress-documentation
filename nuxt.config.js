import { getMetaData } from './utils/getMetaData'

const meta = getMetaData()

export default {
  router: {
    trailingSlash: undefined,
  },
  generate: {
    fallback: true
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico' }],
    script: [{ src: '/js/removeTrailingSlash.js' }],
  },
  /*
   ** Global CSS
   */
  css: ['@/styles/content.css'],
  env: {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_AUTH_TOKEN: process.env.SANITY_AUTH_TOKEN,
    FULLSTORY_ORG_ID: process.env.FULLSTORY_ORG_ID,
    CONTEXT: process.env.CONTEXT,
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['@/plugins/vue-scrollactive', '@/plugins/sanity-client', {src: '@/plugins/fullstory', mode: 'client'}],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/tailwindcss', '@nuxtjs/fontawesome', '@nuxt/image', 'nuxt-build-optimisations'],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxt/content', '@nuxtjs/gtm', '@nuxtjs/sentry'],
  sentry: {
    dsn:
      (process.env.CONTEXT === 'production' && process.env.SENTRY_DSN) ||
      undefined,
  },
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
      remarkPlugins: (_defaultPlugins) => {
        return [
          'remark-directive',
          '~/scripts/remarkPartialPlugin.js',
          'remark-squeeze-paragraphs',
          'remark-slug',
          'remark-autolink-headings',
          'remark-external-links',
          'remark-footnotes',
          'remark-gfm',
        ]
      },
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
        'faBan',
        'faBook',
        'faBug',
        'faCamera',
        'faCheck',
        'faCheckCircle',
        'faCheckSquare',
        'faChevronLeft',
        'faChevronRight',
        'faCode',
        'faCog',
        'faCogs',
        'faDownload',
        'faExclamationTriangle',
        'faExternalLinkAlt',
        'faFileCode',
        'faFolderOpen',
        'faGlobe',
        'faGraduationCap',
        'faHeart',
        'faHistory',
        'faImage',
        'faLongArrowAltUp',
        'faMagic',
        'faMousePointer',
        'faPlayCircle',
        'faPlus',
        'faQuestionCircle',
        'faSearch',
        'faStar',
        'faSyncAlt',
        'faTerminal',
        'faTimes',
        'faTree',
        'faVideo',
      ],
      brands: ['faGithub', 'faTwitter', 'faYoutube'],
    },
  },
}
