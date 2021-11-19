const re = /( *)__VISIT_MOUNT_PLACEHOLDER__/g
const replacer = (text) => {
  return (_, padding) => {
    return text
      .split('\n')
      .map((s) => `${padding}${s}`)
      .join('\n')
  }
}

function processNode(node, { _require, error, warn }) {
  const helpers = _require(__dirname, './helpers/example-helpers')
  const { children } = helpers.getNodeProperties(node)
  const { errorArgs, parts } = helpers.getCodeBlocks(children, { count: 3 })

  if (errorArgs) {
    return error(...errorArgs)
  }

  const [visit, mount, code] = parts
  const visitCombined = code.replace(re, replacer(visit))
  const mountCombined = code.replace(re, replacer(mount))

  return helpers.getCodeGroup(
    {
      label: 'End-to-End Test',
      language: 'js',
      body: visitCombined,
    },
    {
      label: 'Component Test',
      language: 'js',
      body: mountCombined,
    }
  )
}

module.exports = {
  type: 'containerDirective',
  name: 'visit-mount-test-example',
  processNode,
}
