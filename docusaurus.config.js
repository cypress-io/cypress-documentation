// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('./src/theme/prism-material-oceanic')
const { default: remarkDirective } = require('remark-directive')

const fs = require('fs')
const {
  copyTsToJs,
  cypressConfigPluginExample,
  cypressConfigExample,
  visitMountExample,
} = require('./plugins/cypressRemarkPlugins/dist')
const prettierConfig = JSON.parse(fs.readFileSync('./.prettierrc', 'utf-8'))

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cypress Documentation',
  tagline:
    'Fast, easy and reliable testing for anything that runs in a browser.',
  url: 'https://docs.cypress.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: undefined,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/cypress-io/cypress-documentation/tree/main/',
          routeBasePath: '/',
          remarkPlugins: [
            remarkDirective,
            cypressConfigExample,
            cypressConfigPluginExample,
            visitMountExample,
            [
              copyTsToJs,
              {
                prettierOptions: {
                  ...prettierConfig,
                  parser: 'typescript',
                },
              },
            ],
          ],
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        googleAnalytics: {
          trackingID: 'UA-59606812-1',
        },
        googleTagManager: {
          containerId: 'GTM-KNKBWLD',
        },
      },
    ],
  ],

  plugins: [
    [
      './plugins/osano',
      {
        id: 'docs-osano',
      },
    ],
    [
      './plugins/fav-icon',
      {
        id: 'docs-fav-icon',
      },
    ],
    [
      './plugins/fullstory',
      {
        id: 'docs-fullstory',
      },
    ],
    'docusaurus-plugin-sass',
    require.resolve('docusaurus-plugin-image-zoom'),
    // ....
    async function myPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'))
          postcssOptions.plugins.push(require('autoprefixer'))
          return postcssOptions
        },
      }
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: 'img/logo/cypress-logo-circle-dark.png',
      navbar: {
        style: 'dark',
        logo: {
          href: '/guides/overview/why-cypress',
          alt: 'Cypress Logo',
          src: '/img/logo/cypress-logo-light.svg',
          srcDark: '/img/logo/cypress-logo-dark.svg',
        },
        items: [
          {
            to: '/guides/overview/why-cypress',
            label: 'Guides',
            activeBasePath: 'guides',
          },
          {
            to: '/api/table-of-contents',
            label: 'API',
            activeBasePath: 'api',
          },
          {
            to: '/plugins',
            label: 'Plugins',
            activeBasePath: 'plugins',
          },
          {
            to: '/examples/recipes',
            label: 'Examples',
            activeBasePath: 'examples',
          },
          {
            to: '/faq/questions/using-cypress-faq',
            label: 'FAQ',
            activeBasePath: 'faq',
          },
          {
            to: 'https://learn.cypress.io',
            label: 'Learn',
          },
        ],
      },
      // optional, can be commented out
      // Styles for this are controlled in src/css/announcement-bar.scss
      announcementBar: {
        //give id a unique value to get a new announcement bar to appear
        id: 'ga-ui-cov-a11y',
        content: `📢 NEW! Improve app quality with instant insights using <a href="https://www.cypress.io/accessibility">Cypress Accessibility</a> and <a href="https://www.cypress.io/ui-coverage">UI Coverage</a>.`,
        isCloseable: true,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Real World App',
                href: 'https://github.com/cypress-io/cypress-realworld-app',
              },
              {
                label: 'Real World Testing',
                href: 'https://learn.cypress.io',
              },
              {
                label: 'Cypress.io YouTube',
                href: 'https://www.youtube.com/channel/UC-EOsTo2l2x39e4JmSaWNRQ',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/cypress-io/cypress/discussions',
              },
              // {
              //   label: 'Cypress Ambassadors',
              //   href: 'https://www.cypress.io/ambassadors',
              // },
              // {
              //   label: 'Cypress Stack Overflow',
              //   href: 'https://stackoverflow.com/questions/tagged/cypress',
              // },
              {
                label: 'Discord',
                href: 'https://on.cypress.io/discord',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/Cypress_io',
              },
            ],
          },
          {
            title: 'Solutions',
            items: [
              {
                label: 'Cypress App',
                href: 'https://www.cypress.io/features',
              },
              {
                label: 'Cypress Cloud',
                href: 'https://www.cypress.io/cloud',
              },
              {
                label: 'Cypress Migrator',
                href: 'https://migrator.cypress.io',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About',
                href: 'https://www.cypress.io/about-us',
              },
              {
                label: 'Cypress Blog',
                href: 'https://www.cypress.io/blog',
              },
              {
                label: 'Careers',
                href: 'https://www.cypress.io/careers',
              },
              {
                label: 'Support',
                href: 'https://www.cypress.io/support',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Cypress.io. All rights reserved.`,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'R9KDA5FMJB',

        // Public API key: it is safe to commit it
        apiKey: 'b4af59e23bc2fa05281af7dcf13fcae5',

        indexName: 'cypress_docs',

        // Optional: see doc section below
        contextualSearch: false,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: "search",

        //... other Algolia params
      },
      prism: {
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
      },
      zoom: {
        selector: ':not(.mediaImage, .navbar__logo img, .logo, .br-ui)', // don't zoom these images
        background: {
          light: 'rgb(50, 50, 50)',
          dark: 'rgb(50, 50, 50)',
        },
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        config: {
          scrollOffset: 60,
          margin: 100,
        },
      },
    },
}

module.exports = config
