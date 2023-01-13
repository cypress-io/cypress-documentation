import type { Code } from 'mdast'
import type { Node, Parent } from 'unist'

export function isMatchedDirective(
  node: Node,
  tagName: string
): node is Parent {
  return (
    Array.isArray((node as Parent).children) && node.data?.hName === tagName
  )
}

export function isCode(node: Node): node is Code & Parent {
  return node.type === 'code'
}
