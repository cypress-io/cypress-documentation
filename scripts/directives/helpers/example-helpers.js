const endent = require('endent').default

exports.normalizeAttributes = (attributes) => {
  return Object.entries(attributes).reduce((acc, [key, value]) => {
    // {foo=true} or {foo}
    if (value === 'true' || value === '') {
      value = true
    }
    // {foo=false}
    else if (value === 'false') {
      value = false
    }
    // {foo=123.45}
    else if (!isNaN(Number(value)) && String(Number(value)) === value) {
      value = Number(value)
    }

    return {
      ...acc,
      [key]: value,
    }
  }, {})
}

exports.getNodeProperties = ({ children = [], attributes, ...rest }) => {
  return {
    ...rest,
    children,
    attributes: exports.normalizeAttributes(attributes),
  }
}

exports.getHeaderAndBody = (children) => {
  if (
    children.length < 1 ||
    children.length > 2 ||
    !children.every(({ type }) => type === 'code')
  ) {
    const errorArgs = [
      `Expected 1 or 2 code blocks inside directive, instead got`,
      children.map((o) => o.type),
    ]

    return { errorArgs }
  }

  let header = ''
  let body

  if (children.length === 1) {
    body = children[0].value.trim()
  } else {
    header = `\n${children[0].value.trim()}\n`
    body = children[1].value.trim()
  }

  return { header, body }
}

exports.getCodeGroup = (...blocks) => {
  const filterFn = (obj) => obj && obj.body
  const mapFn = ({ label, language, alert = '', body }, i) => {
    const alertCode = alert && `<template v-slot:alert>${alert}</template>`

    return endent`
      <code-block label="${label}"${i === 0 ? ' active' : ''}>
      ${alertCode}

      \`\`\`${language}
      ${body}
      \`\`\`

      </code-block>
    `
  }

  const result = endent`
    <code-group>
    ${blocks.filter(filterFn).map(mapFn).join('\n')}
    </code-group>
  `
  // console.log(result)

  // Workaround for https://github.com/indentjs/endent/issues/10
  return result.replace(/WEIRD_WORKAROUND_SORRY/g, '')
}
