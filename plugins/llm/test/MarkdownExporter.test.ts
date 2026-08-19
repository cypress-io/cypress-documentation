import { test, expect, describe } from 'vitest'
import { createMarkdownProcessor } from '../src/MarkdownExporter'

const toMarkdown = (html: string) => createMarkdownProcessor().turndown(html)

/** The shape Docusaurus renders a code block in: one <div> per line, each ending in a <br>. */
function docusaurusCodeBlock(lines: string[][]) {
  const tokenLines = lines
    .map(
      (spans) =>
        `<div class="token-line">${spans
          .map((span) => `<span class="token plain">${span}</span>`)
          .join('')}<br></div>`
    )
    .join('')

  return `<pre class="prism-code language-js"><code class="codeBlockLines_e6Vv">${tokenLines}</code></pre>`
}

// ---------------------------------------------------------------------------
// Fenced code blocks
//
// Docusaurus renders each line of a code block as its own <div class="token-line">
// ending in a <br>. Reading the block with textContent drops both, which ran every
// line of a multi-line example together into one line that no longer parses.
// ---------------------------------------------------------------------------

describe('fenced code blocks', () => {
  test('keeps each line of a multi-line example on its own line', () => {
    const markdown = toMarkdown(
      docusaurusCodeBlock([
        ['// spying only'],
        ['cy', '.', 'intercept(url)'],
        ['cy', '.', 'intercept(method, url)'],
      ])
    )

    expect(markdown).toContain(
      '// spying only\ncy.intercept(url)\ncy.intercept(method, url)'
    )
  })

  test('does not run statements together', () => {
    const markdown = toMarkdown(
      docusaurusCodeBlock([['const a = 1'], ['const b = 2']])
    )
    expect(markdown).not.toContain('const a = 1const b = 2')
  })

  test('emits one newline per line, not one per <br> and wrapper', () => {
    const markdown = toMarkdown(
      docusaurusCodeBlock([['first()'], ['second()'], ['third()']])
    )
    expect(markdown).toContain('first()\nsecond()\nthird()')
    expect(markdown).not.toContain('first()\n\nsecond()')
  })

  test('preserves indentation inside a block', () => {
    const markdown = toMarkdown(
      docusaurusCodeBlock([
        ['describe(\'suite\', () => {'],
        ['  it(\'works\', () => {})'],
        ['})'],
      ])
    )
    expect(markdown).toContain(
      "describe('suite', () => {\n  it('works', () => {})\n})"
    )
  })

  test('handles a plain code block with no per-line markup', () => {
    const markdown = toMarkdown(
      '<pre><code class="language-bash">npm install cypress</code></pre>'
    )
    expect(markdown).toContain('```bash\nnpm install cypress\n```')
  })

  test('handles newlines carried as text rather than markup', () => {
    const markdown = toMarkdown(
      '<pre><code>line one\nline two\nline three</code></pre>'
    )
    expect(markdown).toContain('```\nline one\nline two\nline three\n```')
  })

  test('trims blank lines at the edges of a block', () => {
    const markdown = toMarkdown(
      docusaurusCodeBlock([[''], ['only()'], ['']])
    )
    expect(markdown).toContain('only()\n```')
    expect(markdown).not.toContain('\n\nonly()')
  })

  test('handles an empty code block without emitting a stray fence', () => {
    expect(toMarkdown('<pre><code></code></pre>').trim()).toBe('')
  })

  test('uses a longer fence when the sample itself contains a fence', () => {
    const markdown = toMarkdown(
      docusaurusCodeBlock([
        ['# cy.prompt export'],
        ['```javascript'],
        ['cy.visit(\'/\')'],
        ['```'],
      ])
    )

    // A three-backtick fence would end the block at the sample's own fence and
    // spill the rest of the page out of the code block.
    expect(markdown).toContain('````\n# cy.prompt export')
    expect(markdown).toContain("cy.visit('/')\n```\n````")
  })

  test('grows the fence past the longest backtick run in the sample', () => {
    const markdown = toMarkdown(docusaurusCodeBlock([['````'], ['nested']]))
    expect(markdown).toContain('`````\n````\nnested\n`````')
  })

  test('keeps the usual three-backtick fence for ordinary code', () => {
    const markdown = toMarkdown(docusaurusCodeBlock([['cy.get(\'.btn\')']]))
    expect(markdown).toContain("```\ncy.get('.btn')\n```")
    expect(markdown).not.toContain('````')
  })

  test('does not disturb inline code', () => {
    expect(toMarkdown('<p>Use <code>cy.get()</code> here.</p>')).toBe(
      'Use `cy.get()` here.'
    )
  })
})
