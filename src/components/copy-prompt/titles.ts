import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { escapeMarkdownHeadingIds } from '@docusaurus/utils'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkFrontmatter from 'remark-frontmatter'

export interface CopyPromptCard {
  file: string
  line: number
  /** The static `title`, or null when it is missing, empty, or computed. */
  title: string | null
}

interface Expression {
  type: string
  value?: unknown
  expressions?: unknown[]
  quasis?: Array<{ value: { cooked?: string | null } }>
}

interface MdxNode {
  type: string
  name?: string | null
  attributes?: Array<{
    type: string
    name?: string
    value?:
      | string
      | null
      | {
          data?: {
            estree?: { body: Array<{ expression?: Expression }> }
          }
        }
  }>
  children?: MdxNode[]
  position?: { start: { line: number } }
}

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter)

// Docusaurus accepts two MDX 1 leftovers that plain MDX rejects: HTML comments,
// which it parses with a remark plugin, and `{#id}` heading anchors, which its
// preprocessor escapes. Comments are blanked rather than removed so every line
// stays where it was and the reported line numbers match the file.
function docusaurusCompatible(source: string): string {
  return escapeMarkdownHeadingIds(
    source.replace(/<!--[\s\S]*?-->/g, (comment) =>
      comment.replace(/[^\n]/g, ' ')
    )
  )
}

// A string or a `{…}` expression that is one string literal or a template with
// no interpolation. Anything else can't be read without running the page, so
// it counts as missing.
function staticTitle(node: MdxNode): string | null {
  const value = node.attributes?.find(
    (a) => a.type === 'mdxJsxAttribute' && a.name === 'title'
  )?.value
  if (typeof value === 'string') return nonEmpty(value)
  const expression =
    value && typeof value === 'object'
      ? value.data?.estree?.body[0]?.expression
      : undefined
  if (expression?.type === 'Literal' && typeof expression.value === 'string') {
    return nonEmpty(expression.value)
  }
  if (
    expression?.type === 'TemplateLiteral' &&
    expression.expressions?.length === 0
  ) {
    return nonEmpty(expression.quasis?.[0]?.value.cooked)
  }
  return null
}

const nonEmpty = (title: string | null | undefined) => title?.trim() || null

export function findCopyPrompts(
  source: string,
  file: string
): CopyPromptCard[] {
  const cards: CopyPromptCard[] = []
  const visit = (node: MdxNode) => {
    if (
      (node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement') &&
      node.name === 'CopyPrompt'
    ) {
      cards.push({
        file,
        line: node.position?.start.line ?? 0,
        title: staticTitle(node),
      })
    }
    node.children?.forEach(visit)
  }
  visit(parser.parse(docusaurusCompatible(source)) as MdxNode)
  return cards
}

export function titleProblems(cards: CopyPromptCard[]): string[] {
  const problems: string[] = []
  const byTitle = new Map<string, CopyPromptCard[]>()
  for (const card of cards) {
    if (card.title === null) {
      problems.push(`${card.file}:${card.line} has no static title`)
      continue
    }
    byTitle.set(card.title, [...(byTitle.get(card.title) ?? []), card])
  }
  for (const [title, shared] of byTitle) {
    if (shared.length < 2) continue
    for (const card of shared) {
      const others = shared
        .filter((other) => other !== card)
        .map((other) => `${other.file}:${other.line}`)
        .join(', ')
      problems.push(
        `${card.file}:${card.line} shares the title "${title}" with ${others}`
      )
    }
  }
  return problems
}

/** Every card in `root`/docs, with paths relative to `root`. */
export function readCopyPrompts(root: string): CopyPromptCard[] {
  return readdirSync(path.join(root, 'docs'), {
    withFileTypes: true,
    recursive: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort()
    .flatMap((file) => {
      const source = readFileSync(file, 'utf8')
      // Parsing is the slow part, and most pages have no card.
      return source.includes('<CopyPrompt')
        ? findCopyPrompts(source, path.relative(root, file))
        : []
    })
}
