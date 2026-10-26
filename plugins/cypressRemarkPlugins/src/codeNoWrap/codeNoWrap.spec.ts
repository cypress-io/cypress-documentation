import type { Code } from 'mdast'
import { expect, it } from 'vitest'
import { codeNoWrap, hasNoWrapFlag } from './codeNoWrap'

const code = (meta: string | null, lang: string | null = 'text'): Code => ({
  type: 'code',
  lang,
  meta,
  value: 'Running:  spec.cy.ts          (1 of 2)',
})

const run = (node: Code) => {
  codeNoWrap()({ type: 'root', children: [node] } as never)
  return (node.data as { hProperties?: { className?: string[] } } | undefined)
    ?.hProperties?.className
}

it('finds the nowrap flag anywhere in the meta', () => {
  expect(hasNoWrapFlag('nowrap')).toBe(true)
  expect(hasNoWrapFlag('title="output.txt" nowrap')).toBe(true)
  expect(hasNoWrapFlag('nowrap showLineNumbers')).toBe(true)
})

it('ignores meta without the flag', () => {
  expect(hasNoWrapFlag(null)).toBe(false)
  expect(hasNoWrapFlag('')).toBe(false)
  expect(hasNoWrapFlag('title="nowrap.txt"')).toBe(false)
  expect(hasNoWrapFlag('nowrapped')).toBe(false)
})

it('adds the class and keeps the language class', () => {
  expect(run(code('nowrap'))).toEqual(['language-text', 'code-nowrap'])
  expect(run(code('title="out.txt" nowrap', 'txt'))).toEqual([
    'language-txt',
    'code-nowrap',
  ])
})

it('leaves blocks without the flag alone', () => {
  expect(run(code(null))).toBeUndefined()
  expect(run(code('title="out.txt"'))).toBeUndefined()
})
