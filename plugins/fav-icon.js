/**
 * Injects the favicon head tags. docusaurus.config.js sets `favicon: undefined`,
 * so this plugin is the only source of them.
 *
 * Note what is deliberately absent: there is no `rel="icon"` entry for
 * favicon.ico. Measured against Chrome 153 and Safari 26.5, a declared ICO beats
 * the SVG in both engines regardless of `sizes` or document order, and Chrome
 * does not even download the SVG — so declaring it costs us the adaptive icon.
 * The file is still shipped and still served at /favicon.ico, which is where
 * crawlers, unfurlers and Safari before 26 look for it by convention.
 *
 * `rel="mask-icon"` is absent for the same kind of reason: Safari stopped
 * requiring a monochrome pinned-tab SVG in Safari 12, and it is inert in 26.5.
 */
module.exports = async function favIcon(context) {
  return {
    name: 'docusaurus-plugin-favicon',
    injectHtmlTags({ content }) {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              type: 'image/svg+xml',
              href: '/favicon.svg?v=2',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'apple-touch-icon',
              sizes: '180x180',
              href: '/apple-touch-icon.png',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'manifest',
              href: '/site.webmanifest',
            },
          },
        ],
      }
    },
  };
};
