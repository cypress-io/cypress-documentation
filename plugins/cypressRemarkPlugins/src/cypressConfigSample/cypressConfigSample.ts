import type { Code, Content } from 'mdast'
import type { Node } from 'unist'
import visit from 'unist-util-visit'
import { createDirective } from '../utils/createDirective'
import { isCode, isMatchedDirective } from '../utils/matchHelpers';

export function cypressConfigSample(this: any) {
  const tagName = 'cypress-config-sample'
  createDirective(this, tagName)
  return (root) => {
    visit(root, 'containerDirective', (node: Node) => {
      if (isMatchedDirective(node, tagName)) {
        let result: Node[] = []
        if (node.children.length === 1 && isCode(node.children[0])) {
          result = transformNode(node.children[0])
        } else {
          result = node.children
        }
        node.children = result
      }
    })
  }
}

function transformNode(node: Code) {
  const tsCode = node.value

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
