import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { findCopyPrompts, readCopyPrompts, titleProblems } from './titles'

// Each card's title is its `promptTitle` in Fullstory, so a missing or shared
// title merges cards that analytics needs to tell apart.
describe('CopyPrompt titles in docs/', () => {
  const root = path.resolve(__dirname, '../../..')
  const cards = readCopyPrompts(path.join(root, 'docs'), root)

  test('finds the cards', () => {
    expect(cards.length).toBeGreaterThan(0)
  })

  test('every card has a title no other card uses', () => {
    expect(titleProblems(cards)).toEqual([])
  })
})

describe('findCopyPrompts', () => {
  test('reads string and static expression titles, with their lines', () => {
    const source = [
      '---',
      'title: A page',
      '---',
      '',
      '## A heading {#a-heading}',
      '',
      '<!-- a comment',
      'over two lines -->',
      '',
      '<CopyPrompt title="One" prompt="a" />',
      '',
      "<CopyPrompt title={'Two'} prompt={`b <with> /> markup`} />",
      '',
      '<CopyPrompt',
      '  title={`Three`}',
      '  defaultCollapsed',
      '  prompt={`c`}',
      '>',
      '',
      '### Three',
      '',
      '</CopyPrompt>',
    ].join('\n')

    expect(findCopyPrompts(source, 'page.mdx')).toEqual([
      { file: 'page.mdx', line: 10, title: 'One' },
      { file: 'page.mdx', line: 12, title: 'Two' },
      { file: 'page.mdx', line: 14, title: 'Three' },
    ])
  })

  test('treats a missing, empty, or computed title as missing', () => {
    const source = [
      '<CopyPrompt prompt="a" />',
      '',
      '<CopyPrompt title="  " prompt="b" />',
      '',
      '<CopyPrompt title={`${name}`} prompt="c" />',
    ].join('\n')

    expect(
      findCopyPrompts(source, 'page.mdx').map((card) => card.title)
    ).toEqual([null, null, null])
  })
})

describe('titleProblems', () => {
  test('names the file and line of every offender', () => {
    expect(
      titleProblems([
        { file: 'a.mdx', line: 3, title: 'Same' },
        { file: 'b.mdx', line: 8, title: null },
        { file: 'c.mdx', line: 12, title: 'Same' },
        { file: 'c.mdx', line: 20, title: 'Unique' },
      ])
    ).toEqual([
      'b.mdx:8 has no static title',
      'a.mdx:3 shares the title "Same" with c.mdx:12',
      'c.mdx:12 shares the title "Same" with a.mdx:3',
    ])
  })
})
