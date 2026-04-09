import type { Root, Content, Parent, PhrasingContent } from 'mdast'
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
  MdxJsxTextElement,
} from 'mdast-util-mdx-jsx'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'

const htmlTableProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark)
  .use(remarkGfm)

function htmlFragmentToMdastContent(html: string): Content[] {
  const hast = htmlTableProcessor.parse(html)
  const md = htmlTableProcessor.runSync(hast) as Root
  return md.children as Content[]
}

const markdownFragmentParser = unified().use(remarkParse).use(remarkGfm)

function parseMarkdownFragment(md: string): Content[] {
  const tree = markdownFragmentParser.parse(md.trim() || '') as Root
  return tree.children as Content[]
}

function isPascalCaseJsxName(name: string | null | undefined): boolean {
  return !!name && /^[A-Z]/.test(name)
}

/**
 * Docusaurus custom heading IDs (`### Title {#slug}`) are not valid MDX: `{#...}` is parsed as a
 * JS expression and breaks acorn. Strip only when `{#…}` is the trailing token on an ATX heading line.
 */
function stripDocusaurusHeadingIds(raw: string): string {
  return raw.replace(/^(\s{0,3}#{1,6}\s[^\n]+?)\s*\{#[^}]+\}\s*$/gm, '$1')
}

function jsxStringAttribute(
  attributes: Array<MdxJsxAttribute | MdxJsxExpressionAttribute>,
  name: string,
): string | undefined {
  for (const attr of attributes) {
    if (attr.type !== 'mdxJsxAttribute' || attr.name !== name) {
      continue
    }
    const v = attr.value
    if (typeof v === 'string') {
      return v
    }
  }
  return undefined
}

/** Inline `<Icon title="…"/>` → `…` for plain-markdown export. */
function replaceIconTextJsxWithTitle(tree: Root): void {
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type !== 'mdxJsxTextElement') {
      return
    }
    const el = n as MdxJsxTextElement
    if (el.name !== 'Icon') {
      return
    }
    const title = jsxStringAttribute(el.attributes, 'title') || jsxStringAttribute(el.attributes, 'aria-label')
    const value = title !== undefined && title !== '' ? `${title}` : ''
    arr.splice(i, 1, { type: 'text', value } as PhrasingContent)
  })
}

/** Visit from leaves upward so splices on parents do not skip unvisited nodes. */
function walkContentReverse(nodes: Content[] | undefined, fn: (n: Content, i: number, arr: Content[]) => void): void {
  if (!nodes?.length) {
    return
  }
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]
    if ('children' in n && Array.isArray((n as Parent).children)) {
      walkContentReverse((n as Parent).children as Content[], fn)
    }
    fn(n, i, nodes)
  }
}

function removeMdxEsm(tree: Root): void {
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type === 'mdxjsEsm') {
      arr.splice(i, 1)
    }
  })
}

function replaceTableJsxWithMdast(tree: Root): void {
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    /** Build HTML from MDX JSX table trees so rehype can turn them into GFM tables. */
    if (n.type === 'mdxJsxFlowElement' && n.name === 'table') {
      const html = flowElementToHtml(n)
      const rep = htmlFragmentToMdastContent(html)
      arr.splice(i, 1, ...rep)
    }
  })
}

function replacePartialsAndStripPascalFlow(
  tree: Root,
  partials: Record<string, string> | null,
): void {
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type !== 'mdxJsxFlowElement') {
      return
    }
    const flow = n as MdxJsxFlowElement
    const name = flow.name
    if (!isPascalCaseJsxName(name)) {
      return
    }
    if (name === 'Icon') {
      const title = jsxStringAttribute(flow.attributes, 'title')
      const value = title !== undefined && title !== '' ? `${title}` : 'Icon'
      arr.splice(i, 1, {
        type: 'paragraph',
        children: [{ type: 'text', value }],
      } as Content)
      return
    }
    const partialBody = partials?.[name as string]
    if (partialBody !== undefined) {
      const injected = parseMarkdownFragment(partialBody)
      arr.splice(i, 1, ...injected)
      return
    }
    arr.splice(i, 1)
  })
}

function stripPascalCaseTextJsx(tree: Root): void {
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type === 'mdxJsxTextElement' && isPascalCaseJsxName((n as MdxJsxTextElement).name)) {
      arr.splice(i, 1)
    }
  })
}

function stripDirectiveParagraphs(tree: Root): void {
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type !== 'paragraph') {
      return
    }
    const t = toString(n).trim()
    if (/^:{3,}/.test(t)) {
      arr.splice(i, 1)
    }
  })
}

/** remark-stringify does not handle MDX nodes; strip/flatten any that remain (e.g. lowercase HTML-like `<div>`). */
function flattenResidualMdxForMarkdownStringify(tree: Root): void {
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type === 'mdxJsxFlowElement') {
      const text = toString(n).trim()
      arr.splice(i, 1, {
        type: 'paragraph',
        children: text ? [{ type: 'text', value: text }] : [],
      } as Content)
    }
  })
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type === 'mdxJsxTextElement') {
      const text = toString(n)
      arr.splice(i, 1, { type: 'text', value: text } as PhrasingContent)
    }
  })
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type === 'mdxFlowExpression') {
      const text = toString(n).trim()
      arr.splice(i, 1, {
        type: 'paragraph',
        children: text ? [{ type: 'text', value: text }] : [],
      } as Content)
    }
  })
  walkContentReverse(tree.children as Content[], (n, i, arr) => {
    if (n.type === 'mdxTextExpression') {
      const text = toString(n)
      arr.splice(i, 1, { type: 'text', value: text } as PhrasingContent)
    }
  })
}

function mergeAdjacentTextNodes(nodes: PhrasingContent[]): PhrasingContent[] {
  const out: PhrasingContent[] = []
  for (const n of nodes) {
    const last = out[out.length - 1]
    if (n.type === 'text' && last?.type === 'text') {
      ;(last as { type: 'text'; value: string }).value += (n as { type: 'text'; value: string }).value
    } else {
      out.push(n)
    }
  }
  return out
}

/**
 * Headings must keep real mdast `link` nodes (not `[text](url)` stuffed into a `text` node).
 * Otherwise remark-stringify escapes `[` / `(` in heading text, yielding `\\[` / `\\(`.
 */
function normalizeChildren(nodes: PhrasingContent[]): PhrasingContent[] {
  const out: PhrasingContent[] = []
  for (const node of nodes) {
    if (node.type === 'link') {
      out.push({
        type: 'link',
        url: node.url,
        title: node.title,
        children: normalizeChildren(node.children as PhrasingContent[]),
      } as PhrasingContent)
    } else if (node.type === 'text') {
      out.push(node)
    } else if ('children' in node && Array.isArray((node as Parent).children)) {
      const t = toString(node as Parameters<typeof toString>[0])
      if (t) out.push({ type: 'text', value: t })
    } else {
      out.push({ type: 'text', value: toString(node as Parameters<typeof toString>[0]) })
    }
  }
  return mergeAdjacentTextNodes(out)
}

function cleanHeadings(tree: Root): void {
  visit(tree, 'heading', (node) => {
    node.children = normalizeChildren(node.children as PhrasingContent[])
  })
}

/**
 * Strips MDX-only syntax and optionally replaces imported partial components with their normalized markdown bodies.
 * Uses remark-mdx + AST transforms; falls back to line-based normalization when MDX cannot be parsed.
 */
export function normalizeContent(
  filepath: string,
  raw: string,
  partials: Record<string, string> | null,
): string {
  try {
    const preprocessed = stripDocusaurusHeadingIds(raw.replace(/<!--[\s\S]*?-->/g, ''))
    const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm)
    const tree = processor.parse(preprocessed) as Root

    removeMdxEsm(tree)
    replaceTableJsxWithMdast(tree)
    replacePartialsAndStripPascalFlow(tree, partials)
    replaceIconTextJsxWithTitle(tree)
    stripPascalCaseTextJsx(tree)
    cleanHeadings(tree)
    stripDirectiveParagraphs(tree)
    flattenResidualMdxForMarkdownStringify(tree)

    const stringifier = unified()
      .use(remarkGfm)
      .use(remarkStringify, {
        bullet: '-',
        fences: true,
        incrementListMarker: true,
      })

    const out = stringifier.stringify(tree) as string
    return out.replace(/\n{3,}/g, '\n\n').trim() + '\n'
  } catch(err) {
    console.error(`Failed to normalize content using MDX`, { filepath, msg: err?.['message'] })
    throw err
  }
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
  if (!attrs?.length) {
    return ''
  }
  const parts: string[] = []
  for (const a of attrs) {
    if (a.type === 'mdxJsxExpressionAttribute') {
      continue
    }
    if (a.type !== 'mdxJsxAttribute') {
      continue
    }
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
      if (!tag) {
        return node.children.map((c) => phrasingToHtml(c as PhrasingContent)).join('')
      }
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
  if (!tag) {
    return ''
  }
  const inner = node.children.map(flowChildToHtml).join('')
  const attrs = formatJsxAttributes(node.attributes)
  return `<${tag}${attrs}>${inner}</${tag}>`
}