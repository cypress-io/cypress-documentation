import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
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

interface MdxNode {
  type: string
  name?: string | null
  attributes?: Array<{
    type: string
    name?: string
    value?: string | null | { type: string; value: string }
  }>
  children?: MdxNode[]
  position?: { start: { line: number } }
}

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter)

// Docusaurus accepts two MDX 1 leftovers that plain MDX rejects: HTML comments
// and `{#id}` heading anchors. Blank the first and escape the second the way
// its preprocessor does, keeping every line where it was so the reported line
// numbers match the file.
function docusaurusCompatible(source: string): string {
  return source
    .replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\n]/g, ' '))
    .replace(/^(#{1,6}[ \t].*?)\{#([^}]+)\}[ \t]*$/gm, '$1\\{#$2\\}')
}

// `title="…"`, or a `title={…}` expression that is a single quoted or template
// string with no interpolation. Anything else can't be read without running
// the page, so it counts as missing.
function staticTitle(node: MdxNode): string | null {
  const attribute = node.attributes?.find(
    (a) => a.type === 'mdxJsxAttribute' && a.name === 'title'
  )
  const value = attribute?.value
  let title: string | null = null
  if (typeof value === 'string') {
    title = value
  } else if (value && typeof value === 'object') {
    const match = value.value
      .trim()
      .match(/^(['"`])((?:(?!\1)[^\\$]|\\.)*)\1$/s)
    title = match ? match[2] : null
  }
  return title && title.trim() ? title.trim() : null
}

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

export function mdxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort()
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

export function readCopyPrompts(docsDir: string, root: string) {
  return mdxFiles(docsDir).flatMap((file) =>
    findCopyPrompts(readFileSync(file, 'utf8'), path.relative(root, file))
  )
}
