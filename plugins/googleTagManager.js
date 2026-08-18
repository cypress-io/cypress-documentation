const skipForAutomation = require('./skipForAutomation')

// Replaces the bundled @docusaurus/plugin-google-tag-manager so the container can
// be skipped under Cypress. The container carries Pendo and GA4 G-66E86SXGKY, so
// leaving it to the bundled plugin means every automated page visit is counted as
// a real one.
//
// The inline script and noscript iframe are Google's public GTM bootstrap, which
// has been stable for years. The Docusaurus plugin is a thin wrapper around that
// same snippet; aside from the guards below, the markup matches what it emits.
//
// Two independent skips:
// - NODE_ENV !== 'production' matches the bundled plugin (and plugins/fullstory.js):
//   `npm start` must not load GTM-KNKBWLD, or local browsing sends real Pendo/GA4.
// - skipForAutomation covers Cypress against a production build, where NODE_ENV is
//   already 'production' and a NODE_ENV check cannot help.
module.exports = async function googleTagManager(context, options) {
  const { containerId } = options
  const isProd = process.env.NODE_ENV === 'production'

  return {
    name: 'docusaurus-plugin-google-tag-manager-guarded',
    injectHtmlTags() {
      if (!isProd) {
        return {}
      }
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.googletagmanager.com',
            },
          },
          {
            tagName: 'script',
            innerHTML: skipForAutomation(`
window.dataLayer = window.dataLayer || [];
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerId}');
            `.trim()),
          },
        ],
        preBodyTags: [
          {
            tagName: 'noscript',
            innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          },
        ],
      }
    },
  }
}
