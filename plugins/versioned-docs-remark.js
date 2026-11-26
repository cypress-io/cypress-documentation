// For pages in versioned_docs/version-<name>/: prefixes absolute doc links
// with /<name>, which Docusaurus does not do, and imports the page's
// components from .versions/<name>/components.js. An imported name overrides
// the global MDXComponents one, so the page uses its tag's components.

const fs = require('fs')
const path = require('path')
const acorn = require('acorn')

const VERSIONED_FILE = /[\\/]versioned_docs[\\/]version-([^\\/]+)[\\/]/
const LINK_ATTRIBUTES = new Set(['href', 'to', 'link'])

const cache = new Map()

function versionInfo(siteDir, name) {
  if (!cache.has(name)) {
    const docsDir = path.join(siteDir, 'versioned_docs', `version-${name}`)
    const sections = new Set(
      fs
        .readdirSync(docsDir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && e.name !== 'partials')
        .map((e) => e.name)
    )
    const components = new Set(
      JSON.parse(
        fs.readFileSync(
          path.join(siteDir, '.versions', name, 'components.json'),
          'utf8'
        )
      )
    )
    cache.set(name, { sections, components })
  }
  return cache.get(name)
}

function walk(node, visit) {
  visit(node)
  if (node.children) for (const child of node.children) walk(child, visit)
}

function versionedUrl(url, versionPath, sections) {
  if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//'))
    return url
  const first = url.slice(1).split(/[/#?]/, 1)[0]
  return sections.has(first) ? `/${versionPath}${url}` : url
}

module.exports = function versionedDocs({ siteDir }) {
  return (tree, file) => {
    const match = VERSIONED_FILE.exec(file.path || '')
    if (!match) return
    const name = match[1]
    const { sections, components } = versionInfo(siteDir, name)

    const used = new Set()
    const existingEsm = []
    walk(tree, (node) => {
      if (node.type === 'link' || node.type === 'definition') {
        node.url = versionedUrl(node.url, name, sections)
      } else if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        if (node.name && components.has(node.name)) used.add(node.name)
        for (const attr of node.attributes || []) {
          if (
            attr.type === 'mdxJsxAttribute' &&
            LINK_ATTRIBUTES.has(attr.name)
          ) {
            attr.value = versionedUrl(attr.value, name, sections)
          }
        }
      } else if (node.type === 'mdxjsEsm') {
        existingEsm.push(node.value)
      }
    })

    const names = [...used].filter(
      (n) => !existingEsm.some((code) => new RegExp(`\\b${n}\\b`).test(code))
    )
    if (names.length === 0) return

    const code = `import { ${names.join(', ')} } from '@site/.versions/${name}/components.js'`
    tree.children.unshift({
      type: 'mdxjsEsm',
      value: code,
      data: {
        estree: acorn.parse(code, {
          ecmaVersion: 'latest',
          sourceType: 'module',
        }),
      },
    })
  }
}
