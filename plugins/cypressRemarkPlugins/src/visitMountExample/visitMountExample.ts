import type { Code } from 'mdast'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { isCode, isMatchedDirective } from '../utils/matchHelpers'
import { hydrateVisitMountExample } from './hydrateVisitMountExample'

export function visitMountExample(this: any) {
  const tagName = 'visit-mount-example'
  return (root) => {
    visit(root, (node: Node) => {
      if (isMatchedDirective(node, tagName)) {
        let result: Node[] = []
        if (node.children.length === 1 && isCode(node.children[0])) {
          result = transformNode(node.children[0])
        } else {
          return true
        }

        node.data = {
          hName: 'E2EOrCtTabs',
        }
        node.children = result
      }
    })
  }
}

function transformNode(codeNode: Code): Code[] {
  const { visitCode, mountCode } = hydrateVisitMountExample(codeNode.value)

  return [
    {
      type: codeNode.type,
      lang: codeNode.lang,
      meta: codeNode.meta,
      value: visitCode,
    },
    {
      type: codeNode.type,
      lang: codeNode.lang,
      meta: codeNode.meta,
      value: mountCode,
    },
  ]
}
