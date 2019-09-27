const _ = require('lodash')
const assert = require('assert')
const path = require('path')
const fse = require('fs-extra')
const Promise = require('bluebird')
const rawRender = require('../raw_render')

const pathToTypeDoc = path.join(__dirname, '../../source/_data/cypress-typedoc.json')

let getTypeDocPromise

function _getTypeDoc() {
  if (!getTypeDocPromise) {
    getTypeDocPromise = fse.readJson(pathToTypeDoc)
  }

  return getTypeDocPromise
}

const knownKindStrings = {
  'cy': 'Interface',
  'Cypress': 'Module'
}

function _getTypeAtPath(path) {
  return _getTypeDoc()
  .then((type) => {
    path.forEach(name => {
      type = _.find(type.children, (child) => {
        const knownKindString = knownKindStrings[name]

        return child.name === name && (!knownKindString || child.kindString === knownKindString)
      })
    })

    return type
  })
}

function _renderInterface(path, interface) {
  assert.strictEqual(method.kindString, 'Interface')
  let out = 'Option | Default | Description\n'
  out += '--- | --- | ---\n'

  out += _.chain(interface.children)
    .filter({ kindString: 'Property' })
    .sortBy(_.property('name'))
    .map(_renderProperty)
    .value()
  
  return out
}

function _renderMethod(path, method) {
  assert.strictEqual(method.kindString, 'Method')
  let out = ''

  out += '## Syntax\n\n'
  out += '```javascript\n'

  out += method.signatures
    .map(_.partial(_renderSignature, path))
    .join('\n')

  out += '\n```\n\n'

  return out
}

function _renderParameter(parameter) {
  assert.strictEqual(parameter.kindString, 'Parameter')
  return `${parameter.name}${parameter.flags.isOptional ? '?' : ''}: ${parameter.type.name}`
}

function _renderProperty(property) {
  assert.strictEqual(property.kindString, 'Property')
  return `\`${property.name}\` | \`${property.type.name}\` | ${_renderPropertyComment(property.comment)}`
}

function _renderPropertyComment(comment) {
  if (!comment) {
    return ''
  }

  const default = _.find(comment.tags, { tag: 'default' })

  return `${(comment.shortText || '')}${default ? ` (default: \`${default.text}\`)` : ''}`
}

function _renderSignature(path, signature) {
  assert.strictEqual(signature.kindString, 'Call signature')
  return `${path}(${signature.parameters ? signature.parameters.map(_renderParameter).join(', ') : ''})`
}

module.exports = function partial (hexo, [pathString]) {
  const path = _.toPath(`Cypress.${pathString}`)

  return _getTypeAtPath(path)
  .then((type) => {
    const out = ({
      Interface: _renderInterface
      Method: _renderMethod,
    })[type.kindString](pathString, type)

    console.log(out)
    return rawRender(hexo, `<pre>${out}</pre>`, { engine: 'markdown' })
  })
}