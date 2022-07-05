// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const fs = require('fs')
const { copyTsToJs } = require('./plugins/copyTsToJs/dist')
const {
  cypressConfigPluginSample,
  cypressConfigSample,
} = require('./plugins/cypressConfigSamples/dist')
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

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cypress-io', // Usually your GitHub org/user name.
  projectName: 'cypress-docs', // Usually your repo name.

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/cypress-io/cypress-docs/tree/master/',
          routeBasePath: '/',
          lastVersion: 'current',
          remarkPlugins: [
            cypressConfigSample,
            cypressConfigPluginSample,
            [copyTsToJs, { prettierOptions: prettierConfig }],
          ],
          // versions: {
          //   current: {
          //     label: "10",
          //   },
          // },
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
    // async function myPlugin(context, options) {
    //   return {
    //     name: "docusaurus-tailwindcss",
    //     configurePostCss(postcssOptions) {
    //       // Appends TailwindCSS and AutoPrefixer.
    //       postcssOptions.plugins.push(require("tailwindcss"));
    //       postcssOptions.plugins.push(require("autoprefixer"));
    //       return postcssOptions;
    //     },
    //   };
    // },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      navbar: {
        title: '',
        logo: {
          alt: 'My Site Logo',
          src: '/img/logo/cypress-logo-light.png',
          srcDark: '/img/logo/cypress-logo-dark.png',
        },
        items: [
          {
            to: '/',
            label: 'Guides',
            position: 'left',
          },
          {
            to: '/api/commands/and',
            label: 'API',
            position: 'left',
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
          // {
          //   type: "docsVersionDropdown",
          //   position: "right",
          //   dropdownActiveClassDisabled: true,
          // },
          {
            href: 'https://github.com/cypress-io/cypress-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
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
    },
}

module.exports = config
