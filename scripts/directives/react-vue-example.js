// Supports 2-4 code blocks:
// - use md/markdown blocks for alerts
// - use js/javascript/vue blocks for react/vue examples
// - precede a react/vue example with a md/markdown block to create an alert
//   for that example
function processNode(node, { _require, error, warn }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { children = [] } = helpers.getNodeProperties(node)
  const { errorArgs, codeBlocks } = helpers.getCodeBlocks(children, {
    min: 2,
    max: 4,
  })

  if (errorArgs) {
    return error(...errorArgs)
  }

  // Get the first non-md/markdown block (code) preceded by any md/markdown
  // blocks (alert) before it. If no md/markdown blocks are found, there is no alert.
  const getCodeGroupProps = () => {
    const blocks = [
      {},
      ...codeBlocks.splice(
        0,
        codeBlocks.findIndex(
          ({ lang }) => lang !== 'md' && lang !== 'markdown'
        ) + 1
      ),
    ]

    const [alert, code] = blocks.slice(-2)

    return {
      language: code.lang,
      body: code.value,
      alert: alert.value,
    }
  }

  return helpers.getCodeGroup({ syncGroup: 'react-vue' }, [
    {
      label: 'React',
      ...getCodeGroupProps(),
    },
    {
      label: 'Vue',
      ...getCodeGroupProps(),
    },
  ])
}

module.exports = {
  type: 'containerDirective',
  name: 'react-vue-example',
  processNode,
}
