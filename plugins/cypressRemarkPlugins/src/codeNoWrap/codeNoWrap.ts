import type { Code } from 'mdast'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'

// `text` code blocks wrap long lines (see src/css/markdown.scss). Output that
// lines up in columns with spaces breaks when it wraps, so a `nowrap` flag in
// the fence meta opts a block out:
//
//   ```text nowrap
//
// The flag becomes a `code-nowrap` class, which Docusaurus copies onto the
// code block's container, where the CSS skips wrapping.
export const NOWRAP_CLASS = 'code-nowrap'

export function hasNoWrapFlag(meta: string | null | undefined): boolean {
  return /(^|\s)nowrap(\s|$)/.test(meta ?? '')
}

export function codeNoWrap() {
  return (root: Node) => {
    visit(root, 'code', (node: Code) => {
      if (!hasNoWrapFlag(node.meta)) return

      // hProperties replace the className mdast-util-to-hast would set, so
      // keep the language class Docusaurus reads the language from
      const className = [NOWRAP_CLASS]
      if (node.lang) className.unshift(`language-${node.lang}`)

      const data = (node.data ??= {})
      const hProperties = ((data as Record<string, unknown>).hProperties ??=
        {}) as Record<string, unknown>
      hProperties.className = className
    })
  }
}
