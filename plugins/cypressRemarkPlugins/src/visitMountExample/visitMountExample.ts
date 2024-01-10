import type { Code, Content } from 'mdast'
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
          result = node.children
        }
        node.children = result
      }
    })
  }
}

function transformNode(codeNode: Code) {
  const { visitCode, mountCode } = hydrateVisitMountExample(codeNode.value)

  return [
    {
      type: 'jsx',
      value: `<E2EOrCtTabs>\n`,
    },
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
    {
      type: 'jsx',
      value: `</E2EOrCtTabs>\n`,
    },
  ] as Content[]
}
