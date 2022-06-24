const endent = require('endent').default

function processNode(node, { error }) {
  const { attributes } = node
  const { option } = attributes

  if (!option) {
    return error(
      `Found a "::testing-type-specific-option" directive without a "option" attribute. This directive should look like "::testing-type-specific-option{option=configOptionName}".`
    )
  }

  return endent`
    <Alert type="info">

    <strong class="alert-header"><Icon name="cogs"></Icon> \`${option}\` per testing
    type</strong>

    Depending on which [testing type](/guides/core-concepts/testing-types)
    you are using, you can configure your \`${option}\` accordingly.

    - [component](/guides/references/configuration#component)
    - [e2e](/guides/references/configuration#e2e)

    </Alert>`
}

module.exports = {
  type: 'leafDirective',
  name: 'testing-type-specific-option',
  processNode,
}
