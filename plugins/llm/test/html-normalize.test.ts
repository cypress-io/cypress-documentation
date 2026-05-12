import { describe, test, expect } from 'vitest'
import { normalizeHtml } from '../src/html-normalize'

// ---------------------------------------------------------------------------
// normalizeHtml — content extraction
// ---------------------------------------------------------------------------

describe('normalizeHtml — content extraction', () => {
  test('extracts content from <main data-cy="content">', () => {
    const html = `
      <html><body>
        <nav><p>Navigation</p></nav>
        <main data-cy="content"><p>Main content</p></main>
        <footer><p>Footer</p></footer>
      </body></html>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Main content')
    expect(result).not.toContain('Navigation')
    expect(result).not.toContain('Footer')
  })

  test('falls back to <article> when no <main data-cy="content">', () => {
    const html = `
      <html><body>
        <nav><p>Navigation</p></nav>
        <article><p>Article content</p></article>
      </body></html>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Article content')
    expect(result).not.toContain('Navigation')
  })

  test('falls back to <main> when no <article> or <main data-cy="content">', () => {
    const html = `
      <html><body>
        <nav><p>Navigation</p></nav>
        <main><p>Main content</p></main>
      </body></html>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Main content')
    expect(result).not.toContain('Navigation')
  })

  test('falls back to <body> when no <main> or <article>', () => {
    const html = `
      <html><body><p>Body content</p></body></html>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Body content')
  })

  test('returns entire input when no structural elements found', () => {
    const html = '<p>Just a paragraph</p>'
    const result = normalizeHtml(html)
    expect(result).toContain('Just a paragraph')
  })

  test('<main data-cy="content"> takes priority over <article>', () => {
    const html = `
      <html><body>
        <article><p>Article content</p></article>
        <main data-cy="content"><p>Main content</p></main>
      </body></html>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Main content')
    expect(result).not.toContain('Article content')
  })
})

// ---------------------------------------------------------------------------
// normalizeHtml — exclusive filter
// ---------------------------------------------------------------------------

describe('normalizeHtml — exclusive filter', () => {
  test('drops elements with data-sanitize attribute', () => {
    const html = `
      <main data-cy="content">
        <p>Visible</p>
        <div data-sanitize><p>Hidden</p></div>
      </main>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Visible')
    expect(result).not.toContain('Hidden')
  })

  test('drops elements with productHeading_ class', () => {
    const html = `
      <main data-cy="content">
        <p>Visible</p>
        <div class="productHeading_abc123"><p>Product Heading</p></div>
      </main>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Visible')
    expect(result).not.toContain('Product Heading')
  })

  test('drops elements with tocMobile_ class', () => {
    const html = `
      <main data-cy="content">
        <p>Visible</p>
        <nav class="tocMobile_xyz"><a href="/page">TOC Link</a></nav>
      </main>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Visible')
    expect(result).not.toContain('TOC Link')
  })

  test('drops elements with noPrint_ class', () => {
    const html = `
      <main data-cy="content">
        <p>Visible</p>
        <div class="noPrint_abc"><a href="/edit">Edit this page</a></div>
      </main>
    `
    const result = normalizeHtml(html)
    expect(result).toContain('Visible')
    expect(result).not.toContain('Edit this page')
  })
})

// ---------------------------------------------------------------------------
// normalizeHtml — anchor tag handling
// ---------------------------------------------------------------------------

describe('normalizeHtml — anchor tag handling', () => {
  test('preserves anchor tags with real text', () => {
    const html = `<main data-cy="content"><a href="/guides/overview">Read the guide</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('Read the guide')
  })

  test('removes anchor tags with only whitespace', () => {
    const html = `<main data-cy="content"><p>text</p><a href="/guides/overview">   </a></main>`
    const result = normalizeHtml(html)
    expect(result).not.toContain('href="/llm/markdown/guides/overview.md"')
  })

  test('removes anchor tags with only zero-width characters', () => {
    const html = `<main data-cy="content"><p>text</p><a href="/guides/overview">\u200B\u200C\u200D\uFEFF</a></main>`
    const result = normalizeHtml(html)
    expect(result).not.toContain('href="/llm/markdown/guides/overview.md"')
  })

  test('preserves anchor tags with real text mixed with zero-width characters', () => {
    const html = `<main data-cy="content"><a href="/guides/overview">Click\u200Bhere</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="/llm/markdown/guides/overview.md"')
  })
})

// ---------------------------------------------------------------------------
// normalizeHtml — href transformation
// ---------------------------------------------------------------------------

describe('normalizeHtml — href transformation', () => {
  test('rewrites root-relative href to /llm/markdown path', () => {
    const html = `<main data-cy="content"><a href="/guides/overview">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="/llm/markdown/guides/overview.md"')
  })

  test('rewrites ./ relative href to /llm/markdown path', () => {
    const html = `<main data-cy="content"><a href="./guides/overview">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="/llm/markdown/guides/overview.md"')
  })

  test('converts .html extension to .md', () => {
    const html = `<main data-cy="content"><a href="/guides/overview.html">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="/llm/markdown/guides/overview.md"')
  })

  test('preserves already-.md hrefs unchanged', () => {
    const html = `<main data-cy="content"><a href="/guides/overview.md">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="/llm/markdown/guides/overview.md"')
  })

  test('preserves query parameters when rewriting href', () => {
    const html = `<main data-cy="content"><a href="/guides/overview?tab=api">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="/llm/markdown/guides/overview.md?tab=api"')
  })

  test('preserves hash fragment when rewriting href', () => {
    const html = `<main data-cy="content"><a href="/guides/overview#section">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="/llm/markdown/guides/overview.md#section"')
  })

  test('leaves absolute https:// URLs unchanged', () => {
    const html = `<main data-cy="content"><a href="https://example.com/page">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="https://example.com/page"')
  })
})

// ---------------------------------------------------------------------------
// normalizeHtml — URI scheme filtering
// ---------------------------------------------------------------------------

describe('normalizeHtml — URI scheme filtering', () => {
  test('preserves https:// links', () => {
    const html = `<main data-cy="content"><a href="https://cypress.io">Link</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="https://cypress.io"')
  })

  test('preserves mailto: links', () => {
    const html = `<main data-cy="content"><a href="mailto:test@example.com">Email</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="mailto:test@example.com"')
  })

  test('preserves tel: links', () => {
    const html = `<main data-cy="content"><a href="tel:+15555555555">Call</a></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('href="tel:+15555555555"')
  })

  test('strips javascript: hrefs', () => {
    const html = `<main data-cy="content"><a href="javascript:alert(1)">Click</a></main>`
    const result = normalizeHtml(html)
    expect(result).not.toContain('javascript:')
  })
})

// ---------------------------------------------------------------------------
// normalizeHtml — disallowed tag stripping
// ---------------------------------------------------------------------------

describe('normalizeHtml — disallowed tag stripping', () => {
  test('removes <script> tags and their contents', () => {
    const html = `<main data-cy="content"><p>Safe</p><script>alert('xss')</script></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('Safe')
    expect(result).not.toContain('alert')
    expect(result).not.toContain('<script>')
  })

  test('removes <style> tags and their contents', () => {
    const html = `<main data-cy="content"><p>Safe</p><style>body { display: none }</style></main>`
    const result = normalizeHtml(html)
    expect(result).toContain('Safe')
    expect(result).not.toContain('display: none')
    expect(result).not.toContain('<style>')
  })
})
