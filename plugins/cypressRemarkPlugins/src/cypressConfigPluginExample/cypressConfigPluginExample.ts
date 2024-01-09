import type { Code, Content, Root } from 'mdast'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { hydratePluginSample } from './hydratePluginSample'
import { isCode, isMatchedDirective } from '../utils/matchHelpers'

export function cypressConfigPluginExample(this: any) {
  const tagName = 'cypress-config-plugin-example'
  return (root: Root) => {
    //@ts-ignore
    visit(root, (node: Node) => {
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
