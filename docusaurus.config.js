// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/dracula')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
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
  tagline: '',
  url: 'https://docs.cypress.io',
  baseUrl: '/',
  onBrokenLinks: 'warn', // TODO: update this to throw when we go live to production
  onBrokenMarkdownLinks: 'warn',
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
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/cypress-io/cypress-docs/tree/master/',
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
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    './plugins/fav-icon',
    require.resolve('docusaurus-plugin-image-zoom')
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
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
            activeBaseRegex: 'guides',
          },
          {
            to: '/api/commands/and',
            label: 'API',
            position: 'left',
            activeBaseRegex: 'api',
          },
          {
            to: '/plugins',
            label: 'Plugins',
            position: 'left',
          },
          {
            to: '/examples/recipes',
            label: 'Examples',
            position: 'left',
          },
          {
            to: '/faq/questions/using-cypress-faq',
            label: 'FAQ',
            position: 'left',
          },
          {
            to: 'https://learn.cypress.io',
            label: 'Learn',
            position: 'left',
          },
          {
            to: 'https://v9.docs.cypress.io',
            label: 'v9 Docs',
            position: 'right',
          },
          {
            href: 'https://github.com/cypress-io/cypress-docs',
            position: 'right',
            className: 'github-logo',
            'aria-label': 'Cypress GitHub repository',
          },
          {
            href: 'https://twitter.com/Cypress_io',
            position: 'right',
            className: 'twitter-logo',
            'aria-label': 'Cypress Twitter',
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
      announcementBar: {
        content:
          '🚀 &nbsp;Looking to move to Cypress v10? Check out the <a target="_blank" rel="noopener noreferrer" href="/guides/references/migration-guide">migration guide!</a>',
        backgroundColor: '#fff3b9',
        textColor: '#091E42',
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
                label: 'Cypress Dashboard',
                href: 'https://www.cypress.io/dashboard',
              },
              {
                label: 'Cypress Migrator',
                href: 'https://migrator.cypress.io',
              }
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About',
                href: 'https://www.cypress.io/about',
              },
              {
                label: 'Jobs',
                href: 'https://www.cypress.io/jobs',
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
        apiKey: '6c33afcbecc2ae25e0ad096a113f7562',

        indexName: 'docs',

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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      zoom: {
        selector: ':not(.mediaImage, .navbar__logo img)', // don't zoom these images
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        config: {}
      }
    },
}

module.exports = config
