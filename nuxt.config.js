export default {
  router: {
    // middleware: 'lower-case-url',
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
    /**
     * Adjust the scroll-to behavior for hashes so that
     * Nuxt can render the content on the page before attempting to
     * adjust the scroll position too early, which could happen before 
     * the content is fully rendered. If this happens, the user will
     * be at an incorrect scroll position. This is a workaround
     * to arbitrarily wait for an amount of time before assuming that
     * Nuxt has rendered everything that needs to appear in the page
     * before attempting to scroll to the hash element.
     * 
     * @see
     * https://github.com/nuxt/nuxt.js/issues/5359
     */
    async scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
  
      const wait = (ms) => new Promise(res => setTimeout(res, ms))
  
      const findEl = async (hash, x = 0) => {
        // arbitrarily waiting for nuxt to do its thing on the page
        await wait(300)
 
        return (
          document.querySelector(hash) ||
          new Promise(resolve => {
            if (x > 50) {
              return resolve(document.querySelector("#app"));
            }

            setTimeout(() => {
              resolve(findEl(hash, ++x || 1));
            }, 100);
          })
        );
      };
  
      if (to.hash) {
        let el = await findEl(to.hash);
        // Give the element some breathing room when we scroll it into view
        const TOP_PADDING = 32

        if ("scrollBehavior" in document.documentElement.style) {
          return window.scrollTo({ top: el.offsetTop - TOP_PADDING, behavior: "smooth" });
        }
 
          return window.scrollTo(0, el.offsetTop - TOP_PADDING);
        
      }

      return { x: 0, y: 0 };
    }
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
    script: [
      { src: '/lower-case-url.js' }
    ]
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
