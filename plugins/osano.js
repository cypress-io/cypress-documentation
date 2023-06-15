module.exports = async function favIcon(context) {
  return {
    injectHtmlTags({ content }) {
      return {
        name: 'docusaurus-osano-plugin',
        headTags: [
          {
            tagName: 'script',
            attributes: {
              src: 'https://cmp.osano.com/AzqisZTSBrMdc3qLt/bb12d637-24a5-47ce-8788-92e13ca795cf/osano.js',
            }
          },
        ],
      }
    },
  };
};
