module.exports = async function favIcon(context) {
  return {
    injectHtmlTags({ content }) {
      return {
        name: 'docusaurus-plugin-favicon',
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
              type: 'image/sv+xml',
              href: '/favicon.svg',
            },
          },
        ],
      }
    },
  };
};
