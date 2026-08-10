const skipForAutomation = require('./skipForAutomation')

// Replaces the bundled @docusaurus/plugin-google-tag-manager so the container can
// be skipped under Cypress. The container carries Pendo and GA4 G-66E86SXGKY, so
// leaving it to the bundled plugin means every automated page visit is counted as
// a real one. Aside from the guard, the injected markup matches what that plugin
// emits.
module.exports = async function googleTagManager(context, options) {
  const { containerId } = options

  return {
    name: 'docusaurus-plugin-google-tag-manager-guarded',
    injectHtmlTags() {
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
