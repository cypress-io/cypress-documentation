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
              type: 'image/x-icon',
              href: '/favicon.ico',
              sizes: 'any',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'icon',
              type: 'image/svg+xml',
              href: '/favicon.svg',
            },
          },
        ],
      }
    },
  };
};
