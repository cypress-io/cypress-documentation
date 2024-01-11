import type { Code } from 'mdast'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { isCode, isMatchedDirective } from '../utils/matchHelpers'
import { hydrateConfigSample } from './hydrateConfigSample'

export function cypressConfigExample(this: any) {
  return (root) => {
    visit(root, (node: Node) => {
      if (isMatchedDirective(node, 'cypress-config-example')) {
        let result: Node[] = []
        if (node.children.length === 1 && isCode(node.children[0])) {
          result = transformNode(node.children[0])
        } else if (isCode(node.children[0]) && isCode(node.children[1])) {
          result = transformNode(node.children[1], node.children[0])
        } else {
          return
        }
        node.data = {
          hName: 'CypressConfigFileTabs',
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
      type: codeNode.type,
      lang: 'ts',
      meta: 'copyTsToJs',
      value: tsCode,
    },
  ]
}
