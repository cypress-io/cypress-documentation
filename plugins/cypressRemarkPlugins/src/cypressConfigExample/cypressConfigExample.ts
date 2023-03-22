import type { Code, Content } from 'mdast'
import type { Node } from 'unist'
import visit from 'unist-util-visit'
import { createDirective } from '../utils/createDirective'
import { isCode, isMatchedDirective } from '../utils/matchHelpers';
import { hydrateConfigSample } from './hydrateConfigSample';

export function cypressConfigExample(this: any) {
  const tagName = 'cypress-config-example'
  createDirective(this, tagName)
  return (root) => {
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
  const tsCode = hydrateConfigSample(codeNode.value, importNode?.value)

  return [
    {
      type: 'jsx',
      value: `<CypressConfigFileTabs>\n`,
    },
    {
      type: codeNode.type,
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
