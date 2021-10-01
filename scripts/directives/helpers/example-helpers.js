const endent = require('endent').default

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
  const filterFn = ({ body }) => body !== false
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
