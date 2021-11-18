function processNode(node, { _require, error }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { children } = helpers.getNodeProperties(node)
  const { errorArgs, parts } = helpers.getCodeBlocks(children, { count: 2 })

  if (errorArgs) {
    return error(...errorArgs)
  }

  const [e2eExample, componentExample] = parts

  return helpers.getCodeGroup(
    {
      label: 'End-to-End Test',
      language: 'js',
      body: e2eExample,
    },
    {
      label: 'Component Test',
      language: 'js',
      body: componentExample,
    }
  )
}

module.exports = {
  type: 'containerDirective',
	name: 'e2e-component-example',
  processNode,
}
