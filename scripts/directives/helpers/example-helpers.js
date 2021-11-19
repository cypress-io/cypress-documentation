const endent = require('endent').default

const normalizeValue = (value, { emptyStringIsTrue = true } = {}) => {
  // {foo=bar,123,true,false}
  if (/,/.test(value)) {
    return value
      .split(',')
      .map((str) => normalizeValue(str, { emptyStringIsTrue: false }))
  }

  // {foo=true} or {foo}
  if (value === 'true' || (emptyStringIsTrue && value === '')) {
    return true
  }

  // {foo=false}
  if (value === 'false') {
    return false
  }

  // {foo=123.45}
  if (!isNaN(Number(value)) && String(Number(value)) === value) {
    return Number(value)
  }

  return value
}

exports.normalizeAttributes = (attributes) => {
  return Object.entries(attributes).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: normalizeValue(value),
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

exports.getCodeBlocks = (children, { count, min, max } = {}) => {
  const hasCount = typeof count === 'number'

  if (!hasCount && (typeof min !== 'number' || typeof max !== 'number')) {
    const errorArgs = [
      `Expected either "count" or "min" + "max" options, instead got`,
      { count, min, max },
    ]

    return { errorArgs }
  }

  if (hasCount) {
    min = max = count
  }

  if (
    children.length < min ||
    children.length > max ||
    !children.every(({ type }) => type === 'code')
  ) {
    const countText = hasCount ? count : `${min}-${max}`
    const errorArgs = [
      `Expected ${countText} code blocks inside directive, instead got`,
      children.map((o) => o.type),
    ]

    return { errorArgs }
  }

  const parts = children.map(({ value }) => value.trim())

  return { parts }
}

exports.adjustPluginsFileContent = (code) => {
  // Change require('./ to require('../../
  code = code.replace(/require\((['"])\.\//g, 'require($1../../')

  return code
}

const kebabCase = (str) => str.replace(/[A-Z]/g, (s) => `-${s.toLowerCase()}`)

exports.getCodeGroup = (...args) => {
  // Handle both signatures:
  // - getCodeGroup(...blocks)
  // - getCodeGroup(options, [...blocks])
  let [options, blocks] = Array.isArray(args[1]) ? args : [{}, args]

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

  const codeGroupProps = ['syncGroup'].reduce((acc, name) => {
    if (name in options) {
      return `${acc} ${kebabCase(name)}="${options[name]}"`
    }

    return acc
  }, '')

  const result = endent`
    <code-group${codeGroupProps}>
    ${blocks.filter(filterFn).map(mapFn).join('\n')}
    </code-group>
  `
  // console.log(result)

  // Workaround for https://github.com/indentjs/endent/issues/10
  return result.replace(/__FIX_INDENT__/g, '')
}
