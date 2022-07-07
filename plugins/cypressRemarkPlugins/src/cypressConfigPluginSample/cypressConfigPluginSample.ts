import type { Code, Content, Root } from 'mdast'
import type { Node } from 'unist'
import visit from 'unist-util-visit'
import { createDirective } from '../utils/createDirective'
import { hydratePluginSample } from '../cypressConfigPluginSample/hydratePluginSample'
import { isCode, isMatchedDirective } from '../utils/matchHelpers';

export function cypressConfigPluginSample(this: any) {
  const tagName = 'cypress-plugin-sample'
  createDirective(this, tagName)
  return (root: Root) => {
    visit(root, 'containerDirective', (node: Node) => {
      if (isMatchedDirective(node, tagName)) {
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
