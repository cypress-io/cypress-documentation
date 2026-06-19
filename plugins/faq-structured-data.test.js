import { afterEach, describe, expect, test } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import faqPlugin from './faq-structured-data.js'

const { toPlainText, parseFaq, buildJsonLd, inlinePartials, loadPartialMap } =
  faqPlugin

const tempDirs = []

function makeTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'faq-sd-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

// ---------------------------------------------------------------------------
// toPlainText
// ---------------------------------------------------------------------------

describe('toPlainText', () => {
  test('strips JSX / HTML tags', () => {
    expect(toPlainText('<Icon name="angle-right" /> Hello <strong>there</strong>')).toBe(
      'Hello there'
    )
  })

  test('unwraps markdown links to their text', () => {
    expect(toPlainText('See the [install guide](/app/get-started/install).')).toBe(
      'See the install guide.'
    )
  })

  test('removes images entirely', () => {
    expect(toPlainText('before ![alt text](/img/foo.png) after')).toBe(
      'before after'
    )
  })

  test('removes fenced code blocks', () => {
    const input = 'Run this:\n\n```js\nconst x = 1\n```\n\ndone'
    expect(toPlainText(input)).toBe('Run this: done')
  })

  test('unwraps inline code and emphasis markers', () => {
    expect(toPlainText('Use `cy.get()` with **bold** and _italic_ and ~~strike~~')).toBe(
      'Use cy.get() with bold and italic and strike'
    )
  })

  test('drops admonition / directive markers', () => {
    const input = ':::note\nThis is a note.\n:::'
    expect(toPlainText(input)).toBe('This is a note.')
  })

  test('flattens markdown tables to text', () => {
    const input = '| Header A | Header B |\n| --- | --- |\n| one | two |'
    expect(toPlainText(input)).toBe('Header A Header B one two')
  })

  test('collapses whitespace and trims', () => {
    expect(toPlainText('  a\n\n   b\t c  ')).toBe('a b c')
  })

  test('decodes common HTML entities', () => {
    expect(toPlainText('Tom &amp; Jerry&nbsp;run')).toBe('Tom & Jerry run')
  })

  test('preserves a literal greater-than in prose', () => {
    expect(toPlainText('Select Custom > Add from the drawer')).toBe(
      'Select Custom > Add from the drawer'
    )
  })
})

// ---------------------------------------------------------------------------
// parseFaq
// ---------------------------------------------------------------------------

describe('parseFaq', () => {
  test('extracts question/answer pairs from ### headings', () => {
    const content = [
      '## Category',
      '',
      '### <Icon name="angle-right" /> Is it free?',
      '',
      'Yes, it is free and open source.',
      '',
      '### <Icon name="angle-right" /> What OSes are supported?',
      '',
      'Mac, Linux, and Windows.',
    ].join('\n')

    expect(parseFaq(content)).toEqual([
      { question: 'Is it free?', answer: 'Yes, it is free and open source.' },
      {
        question: 'What OSes are supported?',
        answer: 'Mac, Linux, and Windows.',
      },
    ])
  })

  test('strips leading YAML frontmatter', () => {
    const content = [
      '---',
      "title: 'FAQ'",
      'sidebar_position: 200',
      '---',
      '',
      '### A question?',
      '',
      'An answer.',
    ].join('\n')

    expect(parseFaq(content)).toEqual([
      { question: 'A question?', answer: 'An answer.' },
    ])
  })

  test('treats ## and # as section breaks, not questions', () => {
    const content = [
      '# Page Title',
      '## A category header',
      '### A real question?',
      'The answer.',
      '## Another category',
    ].join('\n')

    const result = parseFaq(content)
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe('A real question?')
  })

  test('ignores ### headings inside fenced code blocks', () => {
    const content = [
      '### Real question?',
      '',
      'Here is a markdown example:',
      '',
      '```md',
      '### This is not a question',
      '```',
      '',
      'End of answer.',
    ].join('\n')

    const result = parseFaq(content)
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe('Real question?')
    // the heading inside the code fence must not leak into the answer text
    expect(result[0].answer).not.toContain('This is not a question')
  })

  test('drops questions whose answer is empty', () => {
    const content = ['### Question with no answer?', '', '## Next section'].join(
      '\n'
    )
    expect(parseFaq(content)).toEqual([])
  })

  test('captures multi-paragraph answers as a single collapsed string', () => {
    const content = [
      '### Multi?',
      '',
      'First paragraph.',
      '',
      'Second paragraph.',
    ].join('\n')

    expect(parseFaq(content)[0].answer).toBe(
      'First paragraph. Second paragraph.'
    )
  })
})

// ---------------------------------------------------------------------------
// buildJsonLd
// ---------------------------------------------------------------------------

describe('buildJsonLd', () => {
  test('produces a valid schema.org FAQPage object', () => {
    const entries = [{ question: 'Q1?', answer: 'A1.' }]
    expect(buildJsonLd(entries)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Q1?',
          acceptedAnswer: { '@type': 'Answer', text: 'A1.' },
        },
      ],
    })
  })

  test('maps every entry to a Question with an acceptedAnswer', () => {
    const entries = [
      { question: 'Q1?', answer: 'A1.' },
      { question: 'Q2?', answer: 'A2.' },
    ]
    const json = buildJsonLd(entries)
    expect(json.mainEntity).toHaveLength(2)
    expect(
      json.mainEntity.every(
        (q) =>
          q['@type'] === 'Question' &&
          q.name &&
          q.acceptedAnswer['@type'] === 'Answer' &&
          q.acceptedAnswer.text
      )
    ).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// loadPartialMap + inlinePartials
// ---------------------------------------------------------------------------

describe('loadPartialMap', () => {
  test('maps component names to partial file paths from MDXComponents', () => {
    const siteDir = makeTempDir()
    fs.mkdirSync(path.join(siteDir, 'src/theme'), { recursive: true })
    fs.writeFileSync(
      path.join(siteDir, 'src/theme/MDXComponents.js'),
      [
        'import UrlAllowList from "@site/docs/partials/_url_allowlist.mdx";',
        "import CloudFreePlan from '@site/docs/partials/_cloud_free_plan.mdx';",
        'import Btn from "@site/src/components/button";',
      ].join('\n')
    )

    const map = loadPartialMap(siteDir)
    expect(map).toEqual({
      UrlAllowList: path.join(siteDir, 'docs/partials/_url_allowlist.mdx'),
      CloudFreePlan: path.join(siteDir, 'docs/partials/_cloud_free_plan.mdx'),
    })
    // non-partial imports are excluded
    expect(map.Btn).toBeUndefined()
  })

  test('returns an empty map when MDXComponents is missing', () => {
    expect(loadPartialMap(makeTempDir())).toEqual({})
  })
})

describe('inlinePartials', () => {
  test('inlines a self-closing partial usage with its file body', () => {
    const dir = makeTempDir()
    const file = path.join(dir, '_allow.mdx')
    fs.writeFileSync(file, '---\ntitle: x\n---\nAllow these URLs.')

    const out = inlinePartials('Before <UrlAllowList /> after', {
      UrlAllowList: file,
    })
    expect(toPlainText(out)).toBe('Before Allow these URLs. after')
  })

  test('inlines a partial with props', () => {
    const dir = makeTempDir()
    const file = path.join(dir, '_plan.mdx')
    fs.writeFileSync(file, 'Free plan details.')

    const out = inlinePartials('<CloudFreePlan product="cloud" />', {
      CloudFreePlan: file,
    })
    expect(toPlainText(out)).toBe('Free plan details.')
  })

  test('resolves partials nested inside other partials', () => {
    const dir = makeTempDir()
    const inner = path.join(dir, '_inner.mdx')
    const outer = path.join(dir, '_outer.mdx')
    fs.writeFileSync(inner, 'inner content')
    fs.writeFileSync(outer, 'outer <Inner /> wrap')

    const out = inlinePartials('start <Outer /> end', {
      Outer: outer,
      Inner: inner,
    })
    expect(toPlainText(out)).toBe('start outer inner content wrap end')
  })

  test('does not recurse infinitely on a self-referential partial', () => {
    const dir = makeTempDir()
    const file = path.join(dir, '_loop.mdx')
    fs.writeFileSync(file, 'loop <Loop /> body')

    const out = inlinePartials('<Loop />', { Loop: file })
    // should terminate and include the body at least once
    expect(out).toContain('body')
  })

  test('replaces unknown / missing partial files with whitespace', () => {
    const out = inlinePartials('a <Missing /> b', {
      Missing: '/does/not/exist.mdx',
    })
    expect(toPlainText(out)).toBe('a b')
  })

  test('leaves content untouched when no partials are present', () => {
    expect(inlinePartials('plain text', {})).toBe('plain text')
  })
})

// ---------------------------------------------------------------------------
// Integration against the real FAQ source files
// ---------------------------------------------------------------------------

describe('integration with repository FAQ pages', () => {
  const siteDir = path.resolve(__dirname, '..')
  const faqFiles = [
    'docs/app/faq.mdx',
    'docs/cloud/faq.mdx',
  ].filter((file) => fs.existsSync(path.join(siteDir, file)))

  test.each(faqFiles)(
    'every ### heading in %s yields a well-formed FAQPage entry',
    (file) => {
      const partialMap = loadPartialMap(siteDir)
      const raw = fs.readFileSync(path.join(siteDir, file), 'utf8')
      const inlined = inlinePartials(raw, partialMap)
      const entries = parseFaq(inlined)

      // Count ### headings outside of fenced code blocks in the source.
      let headingCount = 0
      let inFence = false
      for (const line of raw.split('\n')) {
        if (/^\s*```/.test(line)) inFence = !inFence
        else if (!inFence && /^###\s+/.test(line)) headingCount += 1
      }

      expect(entries.length).toBe(headingCount)
      expect(entries.length).toBeGreaterThan(0)

      const json = buildJsonLd(entries)
      expect(json['@type']).toBe('FAQPage')
      expect(
        json.mainEntity.every(
          (q) =>
            q['@type'] === 'Question' &&
            typeof q.name === 'string' &&
            q.name.length > 0 &&
            q.acceptedAnswer['@type'] === 'Answer' &&
            typeof q.acceptedAnswer.text === 'string' &&
            q.acceptedAnswer.text.length > 0 &&
            // no leftover JSX/markdown tags should remain in the answer
            !/<[a-zA-Z][^>]*>/.test(q.acceptedAnswer.text)
        )
      ).toBe(true)
    }
  )
})
