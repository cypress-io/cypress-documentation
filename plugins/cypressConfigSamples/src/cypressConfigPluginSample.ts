import type { Code, Content, Text } from 'mdast'
import type { Node, Parent } from 'unist'
import visit from 'unist-util-visit'
import { hydratePluginSample } from './hydratePluginSample';

export function cypressConfigPluginSample() {
  return (root) => {
    visit(root, (node: Node) => {
      if (isParent(node)) {
        let index = 0
        while (index < node.children.length) {
          const child = node.children[index]!
          if (matchNode(child)) {
            const result = transformNode(child)
            node.children.splice(index, 1, ...result)
            index += result.length
          } else {
            index += 1
          }
        }
      }
    })
  }
}

function isParent(node: Node): node is Parent {
  return Array.isArray((node as Parent).children)
}

function matchNode(node: Node): node is Code {
  return (
    node.type === 'code' &&
    typeof (node as Code).meta === 'string' &&
    ((node as Code).meta ?? '').startsWith('cypressConfigPluginSample')
  )
}

function transformNode(node: Code) {
  const tsCode = hydratePluginSample(node.value)

  return [
    {
      type: 'jsx',
      value: `<CypressConfigFileTabs>\n`,
    },
    {
      type: node.type,
      lang: 'typescript',
      meta: 'copyTsToJs',
      value: tsCode,
    },
    {
      type: 'jsx',
      value: `\n</CypressConfigFileTabs>`,
    },
  ] as Content[]
}
