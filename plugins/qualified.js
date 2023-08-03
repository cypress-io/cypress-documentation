module.exports = async function fullStory({ context, options }) {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    name: 'docusaurus-plugin-qualified',
    injectHtmlTags({ content }) {
      if (!isProd) {
        return {}
      }
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
              (function(w,q){w['QualifiedObject']=q;w[q]=w[q]||function(){
              (w[q].q=w[q].q||[]).push(arguments)};})(window,'qualified')
            `,
          },
          {
            tagName: 'script',
            attributes: {
              src: 'https://js.qualified.com/qualified.js?token=rBwsq6b6C9SwcRe6',
              async: true,
            },
          },
        ],
      }
    },
  }
}
