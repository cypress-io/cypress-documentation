module.exports = async function osano(context) {
  return {
    name: 'docusaurus-osano-plugin',
    injectHtmlTags({ content }) {
      return {
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
