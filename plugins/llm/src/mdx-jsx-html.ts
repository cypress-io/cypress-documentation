import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
} from 'mdast-util-mdx-jsx'
import type { Content, PhrasingContent } from 'mdast'
import { toString } from 'mdast-util-to-string'

/** Build HTML from MDX JSX table trees so rehype can turn them into GFM tables. */
export function mdxTableJsxToHtmlString(node: MdxJsxFlowElement): string {
  return flowElementToHtml(node)
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(s: string): string {
  return escapeHtml(s)
}

function formatJsxAttributes(
  attrs: Array<MdxJsxAttribute | MdxJsxExpressionAttribute> | null | undefined,
): string {
  if (!attrs?.length) return ''
  const parts: string[] = []
  for (const a of attrs) {
    if (a.type === 'mdxJsxExpressionAttribute') continue
    if (a.type !== 'mdxJsxAttribute') continue
    const v = a.value
    if (v === null || v === undefined) {
      parts.push(a.name)
    } else if (typeof v === 'string') {
      parts.push(`${a.name}="${escapeAttr(v)}"`)
    } else if (v && typeof v === 'object' && v.type === 'mdxJsxAttributeValueExpression') {
      parts.push(`${a.name}="${escapeAttr(v.value)}"`)
    }
  }
  return parts.length ? ' ' + parts.join(' ') : ''
}

function phrasingToHtml(node: PhrasingContent): string {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value)
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`
    case 'link': {
      const inner = node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')
      const title = node.title ? ` title="${escapeAttr(node.title)}"` : ''
      return `<a href="${escapeAttr(node.url)}"${title}>${inner}</a>`
    }
    case 'strong':
      return `<strong>${node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')}</strong>`
    case 'emphasis':
      return `<em>${node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')}</em>`
    case 'delete':
      return `<del>${node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')}</del>`
    case 'break':
      return '<br/>'
    case 'image':
      return `<img src="${escapeAttr(node.url)}" alt="${escapeAttr(node.alt || '')}" />`
    case 'mdxJsxTextElement': {
      const tag = node.name
      if (!tag) return node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')
      const inner = node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')
      const attrs = formatJsxAttributes(node.attributes)
      return `<${tag}${attrs}>${inner}</${tag}>`
    }
    case 'html':
      return node.value || ''
    default:
      return escapeHtml(toString(node))
  }
}

function flowChildToHtml(node: Content): string {
  switch (node.type) {
    case 'paragraph':
      return node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')
    case 'mdxJsxFlowElement':
      return flowElementToHtml(node)
    case 'html':
      return node.value || ''
    default:
      return escapeHtml(toString(node))
  }
}

function flowElementToHtml(node: MdxJsxFlowElement): string {
  const tag = node.name
  if (!tag) return ''
  const inner = node.children.map(flowChildToHtml).join('')
  const attrs = formatJsxAttributes(node.attributes)
  return `<${tag}${attrs}>${inner}</${tag}>`
}
