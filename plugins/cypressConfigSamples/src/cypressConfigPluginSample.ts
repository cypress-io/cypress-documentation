import type { Code, Content, Text, Root } from 'mdast'
import type { Node, Parent } from 'unist'
import visit from 'unist-util-visit'
import { createDirective } from './createDirective'
import { hydratePluginSample } from './hydratePluginSample'

const tagName = 'cypress-plugin-sample'

export function cypressConfigPluginSample(this: any) {
  createDirective(this as any, tagName)
  return (root: Root) => {
    visit(root, 'containerDirective', (node: Node) => {
      if (isParent(node) && node.data?.hName === tagName) {
        let result: Node[] = []
        if (node.children.length === 1 && isCode(node.children[0])) {
          result = transformNode(node.children[0])
        } else if (isCode(node.children[0]) && isCode(node.children[1])) {
          result = transformNode(node.children[1], node.children[0])
        } else {
          result = node.children
        }
        node.children = result
      }
    })
  }
}

function isParent(node: Node): node is Parent {
  return Array.isArray((node as Parent).children)
}

function isCode(node: Node): node is Code {
  return node.type === 'code'
}

function transformNode(codeNode: Code, importNode?: Code) {
  const tsCode = hydratePluginSample(codeNode.value, importNode?.value)

  return [
    {
      type: 'jsx',
      value: `<CypressConfigFileTabs>\n`,
    },
    {
      type: 'code',
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
