import { readFileSync } from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { visit } from 'unist-util-visit'
import { describe, expect, test } from 'vitest'

// Fullstory reports every copy under the card's `title`, so a card without one,
// or two cards sharing one, makes the copy counts unreadable.

const ROOT = path.resolve(__dirname, '../../..')

interface Card {
  location: string
  title: string | null
  problem?: string
}

const blank = (text: string) => text.replace(/[^\n]/g, ' ')

// Docusaurus removes three things before MDX parses a page: the frontmatter,
// `{#id}` heading anchors, and HTML comments. Blank them the same way here,
// keeping every newline so a reported line number still matches the file.
function asDocusaurusParsesIt(source: string): string {
  return source
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, blank)
    .replace(/^(#{1,6} .*?)(\{#[^}]*\})[ \t]*$/gm, (_, heading, id) => {
      return heading + blank(id)
    })
    .replace(/<!--[\s\S]*?-->/g, blank)
}

// A title is checkable only when it is a literal: `title="…"`, or `title={'…'}`
// or a template literal with no `${}` in it.
function literalTitle(value: any): { title: string | null; problem?: string } {
  if (value == null) return { title: null }
  if (typeof value === 'string') return { title: value.trim() || null }
  const expression = value.data?.estree?.body?.[0]?.expression
  if (expression?.type === 'Literal' && typeof expression.value === 'string') {
    return { title: expression.value.trim() || null }
  }
  if (
    expression?.type === 'TemplateLiteral' &&
    expression.expressions.length === 0
  ) {
    return { title: expression.quasis[0].value.cooked.trim() || null }
  }
  return {
    title: null,
    problem: `title is an expression (${value.value}); pass a string literal`,
  }
}

function findCards(): Card[] {
  const files = fg.sync('docs/**/*.mdx', { cwd: ROOT }).sort()
  const parser = unified().use(remarkParse).use(remarkMdx)
  const cards: Card[] = []

  for (const file of files) {
    const source = asDocusaurusParsesIt(
      readFileSync(path.join(ROOT, file), 'utf8')
    )
    let tree
    try {
      tree = parser.parse(source)
    } catch (error) {
      throw new Error(`Could not parse ${file}: ${(error as Error).message}`)
    }
    visit(tree, (node: any) => {
      if (
        (node.type !== 'mdxJsxFlowElement' &&
          node.type !== 'mdxJsxTextElement') ||
        node.name !== 'CopyPrompt'
      ) {
        return
      }
      const location = `${file}:${node.position.start.line}`
      if (node.attributes.some((a: any) => a.type !== 'mdxJsxAttribute')) {
        cards.push({
          location,
          title: null,
          problem: 'spread props hide the title; pass title directly',
        })
        return
      }
      const attribute = node.attributes.find((a: any) => a.name === 'title')
      cards.push({ location, ...literalTitle(attribute?.value) })
    })
  }
  return cards
}

describe('CopyPrompt titles', () => {
  const cards = findCards()

  test('finds the cards in docs/', () => {
    expect(cards.length).toBeGreaterThan(0)
  })

  test('every card passes a title', () => {
    const missing = cards
      .filter((card) => card.title === null)
      .map((card) => `${card.location}: ${card.problem ?? 'no title'}`)
    expect(
      missing,
      `CopyPrompt without a usable title:\n${missing.join('\n')}`
    ).toEqual([])
  })

  test('no two cards share a title', () => {
    const byTitle = new Map<string, string[]>()
    for (const { title, location } of cards) {
      if (title === null) continue
      byTitle.set(title, [...(byTitle.get(title) ?? []), location])
    }
    const duplicates = [...byTitle]
      .filter(([, locations]) => locations.length > 1)
      .map(([title, locations]) => `"${title}": ${locations.join(', ')}`)
    expect(
      duplicates,
      `CopyPrompt titles used more than once:\n${duplicates.join('\n')}`
    ).toEqual([])
  })
})
