import { describe, expect, test } from 'vitest'
import ogPlugin from './og-image-cards.js'

const { wrap, fitTitle, SAFE_WIDTH, MIN_TITLE_SIZE } = ogPlugin

// Same glyph-width estimate the plugin uses for bold titles.
const lineWidth = (line, size) => line.length * size * 0.56

describe('wrap', () => {
  test('keeps every line inside the safe column', () => {
    const text =
      'Spy and stub network requests and responses in Cypress tests with cy.intercept(), including matching, routing, and aliasing.'
    const lines = wrap(text, 22, 0.52, 4)
    for (const line of lines) {
      expect(line.length * 22 * 0.52).toBeLessThanOrEqual(SAFE_WIDTH)
    }
  })

  test('ellipsizes text that overflows the line limit', () => {
    const lines = wrap('word '.repeat(200), 22, 0.52, 2)
    expect(lines).toHaveLength(2)
    expect(lines[1].endsWith('…')).toBe(true)
  })

  test('does not ellipsize text that fits, even with surrounding whitespace', () => {
    expect(wrap('  A A A A A ', 24, 0.52, 3)).toEqual(['A A A A A'])
  })

  test('cuts a single token wider than the column', () => {
    const [line] = wrap(`https://${'x'.repeat(200)}.com`, 30, 0.56, 3)
    expect(line.endsWith('…')).toBe(true)
    expect(lineWidth(line, 30)).toBeLessThanOrEqual(SAFE_WIDTH)
  })
})

test('does not add a trailing ellipsis after a shortened token when the rest fits', () => {
  const lines = wrap(
    `https://${'x'.repeat(200)}.com then a short tail`,
    30,
    0.56,
    3
  )
  expect(lines.at(-1)).toBe('then a short tail')
})

describe('fitTitle', () => {
  test('uses the largest size for a short title', () => {
    expect(fitTitle('intercept')).toMatchObject({
      size: 56,
      lines: ['intercept'],
    })
  })

  test('shrinks a long identifier so it fits on one line', () => {
    const { size, lines } = fitTitle('Cypress.Commands.overwriteQuery')
    expect(lines).toEqual(['Cypress.Commands.overwriteQuery'])
    expect(lineWidth(lines[0], size)).toBeLessThanOrEqual(SAFE_WIDTH)
  })

  test('shows a long docs title in full', () => {
    const title =
      'axeConfig: enable, disable, and scope Axe Core® rules in Cypress Accessibility'
    const { lines } = fitTitle(title)
    expect(lines.join(' ')).toBe(title)
  })

  test('never goes below the minimum size', () => {
    const { size, lines } = fitTitle('word '.repeat(60))
    expect(size).toBe(MIN_TITLE_SIZE)
    expect(lines.at(-1).endsWith('…')).toBe(true)
  })
})
