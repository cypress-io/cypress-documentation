import type { Code } from 'mdast'
import type { Node, Parent } from 'unist'

export function isMatchedDirective(
  node: Node,
  tagName: string,
): node is Parent {
  return (
    (node.type === 'containerDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'textDirective') &&
    'name' in node &&
    node.name === tagName &&
    'children' in node
  )
}

export function isCode(node: Node): node is Code & Parent {
  return node.type === 'code'
}
