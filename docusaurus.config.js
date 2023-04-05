// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('./src/theme/prism-material-oceanic')

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
  onBrokenLinks: 'throw', // TODO: update this to throw when we go live to production
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
            cypressConfigExample,
            cypressConfigPluginExample,
            visitMountExample,
            [copyTsToJs, { prettierOptions: prettierConfig }],
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        googleAnalytics: {
          trackingID: 'UA-59606812-1',
        },
        gtag: {
          trackingID: 'GTM-KNKBWLD',
        },
      },
    ],
  ],

  plugins: [
    './plugins/fav-icon',
    './plugins/fullstory',
    'docusaurus-plugin-sass',
    require.resolve('docusaurus-plugin-image-zoom'),
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
          src: '/img/logo/cypress-logo-dark.png',
        },
        items: [
          {
            to: '/guides/overview/why-cypress',
            label: 'Guides',
            position: 'left',
            activeBasePath: 'guides',
          },
          {
            to: '/api/table-of-contents',
            label: 'API',
            position: 'left',
            activeBasePath: 'api',
          },
          {
            to: '/plugins',
            label: 'Plugins',
            position: 'left',
            activeBasePath: 'plugins',
          },
          {
            to: '/examples/recipes',
            label: 'Examples',
            position: 'left',
            activeBasePath: 'examples',
          },
          {
            to: '/faq/questions/using-cypress-faq',
            label: 'FAQ',
            position: 'left',
            activeBasePath: 'faq',
          },
          {
            to: 'https://learn.cypress.io',
            label: 'Learn',
            position: 'left',
          },
          {
            href: 'https://github.com/cypress-io/cypress-documentation',
            position: 'right',
            className: 'github-logo',
            'aria-label': 'Cypress GitHub repository',
          },
          {
            href: 'https://discord.gg/cypress',
            position: 'right',
            className: 'discord-logo',
            'aria-label': 'Cypress Discord',
          },
        ],
      },
      // optional, can be commented out
      // Styles for this are controlled in src/css/announcement-bar.scss
      // announcementBar: {
      //   //give id a unique value to get a new announcement bar to appear
      //   id: 'event-apis-with-cypress-2-23',
      //   content:
      //     '📢 &nbsp; Save your seat for the Testing APIs with Cypress event Feb 23! <a target="_blank" href="https://community.cypress.io/events/details/cypress-cypress-hq-presents-testing-apis-with-cypress?utm_source=docs&utm_medium=promo_banner&utm_campaign=testing_apis_with_cypress">Register now</a>',
      //   isCloseable: true,

      // },
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
                label: 'YouTube',
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
              //   label: 'Cypress Blog',
              //   href: 'https://www.cypress.io/blog',
              // },
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
                href: 'https://discord.gg/cMjUZg7',
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
                label: 'Careers',
                href: 'https://www.cypress.io/careers',
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
        selector: ':not(.mediaImage, .navbar__logo img)', // don't zoom these images
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
