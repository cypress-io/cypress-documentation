const { faviconHeadTags } = require('@cypress-design/favicon')

// docusaurus.config.js sets `favicon: undefined`, so this plugin is the only
// source of the favicon head tags. The tag list, and the reasoning behind what it
// omits, live in @cypress-design/favicon.
module.exports = async function favIcon() {
  return {
    name: 'docusaurus-plugin-favicon',
    injectHtmlTags: () => ({ headTags: faviconHeadTags() }),
  }
}
