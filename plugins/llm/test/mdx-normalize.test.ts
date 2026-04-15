import { test } from 'vitest'
import { expect } from 'vitest'
import { normalizeContent } from '../src/mdx-normalize'

test('remark-mdx: strips PascalCase flow component and converts table to GFM', () => {
  const src = `<ProductHeading product="app" />

# Title

<table class="x">
  <tr>
    <td>One</td>
    <td>Two</td>
  </tr>
</table>
`
  const out = normalizeContent('', src, null)
  expect(out).toMatch(/^# Title/m)
  expect(out.includes('ProductHeading')).toBe(false)
  expect(out).toMatch(/\| One \| Two \|/)
})

test('partials: replaces PascalCase component with markdown body', () => {
  const src = `# Doc

<InlinePartial />

After.
`
  const out = normalizeContent('', src, { InlinePartial: '## Injected\n\nBody.' })
  expect(out).toMatch(/# Doc/)
  expect(out).toMatch(/## Injected/)
  expect(out).toMatch(/Body\./)
  expect(out.includes('<InlinePartial')).toBe(false)
  expect(out).toMatch(/After\./)
})

test('code inside stripped PascalCase wrapper is not leaked as markdown', () => {
  const src = `# H

<Box>
\`\`\`js
leaked
\`\`\`
</Box>

OK.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('leaked')).toBe(false)
  expect(out).toMatch(/OK/)
})

test('Docusaurus {#heading-id} strips so MDX parses; Icon in link → (title)', () => {
  const src =
    '### Requirements [<Icon name="question-circle" title="Learn about chaining commands"/>](/app/core-concepts/introduction-to-cypress#Chains-of-Commands) {#Requirements}\n'
  const out = normalizeContent('docs/partials/_header-requirements.mdx', src, null)
  expect(out.includes('{#Requirements}')).toBe(false)
  expect(out.includes('<Icon')).toBe(false)
  expect(out).toMatch(/\[Learn about chaining commands\]/)
  expect(out).toMatch(
    /\(\/llm\/markdown\/app\/core-concepts\/introduction-to-cypress.md#Chains-of-Commands\)/,
  )
  expect(out.includes('\\[')).toBe(false)
})

test('removeMdxEsm: strips MDX import and export statements', () => {
  const src = `import Foo from './foo'
export const bar = 42

# Title

Body text.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('import')).toBe(false)
  expect(out.includes('export')).toBe(false)
  expect(out).toMatch(/# Title/)
  expect(out).toMatch(/Body text\./)
})

test('preprocessing: strips HTML comments', () => {
  const src = `# Title

<!-- this is a comment -->

Body text.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('this is a comment')).toBe(false)
  expect(out).toMatch(/# Title/)
  expect(out).toMatch(/Body text\./)
})

test('replacePartialsAndStripPascalFlow: flow Icon with title → title text', () => {
  const src = `# Title

<Icon title="settings" />

After.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('<Icon')).toBe(false)
  expect(out).toMatch(/settings/)
  expect(out).toMatch(/After\./)
})

test('replacePartialsAndStripPascalFlow: flow Icon with no title → fallback "Icon" text', () => {
  const src = `# Title

<Icon />

After.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('<Icon')).toBe(false)
  expect(out).toMatch(/Icon/)
  expect(out).toMatch(/After\./)
})

test('stripDirectiveParagraphs: removes ::: directive fences, preserves surrounding content', () => {
  const src = `Before.

:::note

:::

After.
`
  const out = normalizeContent('', src, null)
  expect(out.includes(':::')).toBe(false)
  expect(out).toMatch(/Before\./)
  expect(out).toMatch(/After\./)
})

test('stripPascalCaseTextJsx: removes inline PascalCase JSX from paragraph text', () => {
  const src = `# Title

See <Badge text="beta" /> for details.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('Badge')).toBe(false)
  expect(out).toMatch(/See/)
  expect(out).toMatch(/for details\./)
})

test('flattenResidualMdxForMarkdownStringify: lowercase JSX flow element text is preserved', () => {
  const src = `# Title

<div>Some content</div>

After.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('<div')).toBe(false)
  expect(out).toMatch(/Some content/)
  expect(out).toMatch(/After\./)
})

test('flattenResidualMdxForMarkdownStringify: MDX flow expression does not crash and is flattened', () => {
  const src = `# Title

{someVariable}

After.
`
  const out = normalizeContent('', src, null)
  expect(out.includes('{')).toBe(false)
  expect(out).toMatch(/# Title/)
  expect(out).toMatch(/After\./)
})

test('rewriteRootRelativeLinks: absolute site paths get /llm/markdown prefix', () => {
  const src = `# Title

[example](/ui-coverage)

[already](/llm/markdown/docs/foo)

[external](https://example.com/path)

[relative](./other.md)
`
  const out = normalizeContent('', src, null)
  expect(out).toMatch(/\[example\]\(\/llm\/markdown\/ui-coverage.md\)/)
  expect(out).toMatch(/\[already\]\(\/llm\/markdown\/docs\/foo.md\)/)
  expect(out).toMatch(/\[external\]\(https:\/\/example\.com\/path\)/)
  expect(out).toMatch(/\[relative\]\(\.\/other\.md\)/)
})

test('normalizeContent: collapses 3+ consecutive blank lines to a single blank line', () => {
  const src = `First paragraph.



Second paragraph.
`
  const out = normalizeContent('', src, null)
  expect(/\n{3,}/.test(out)).toBe(false)
  expect(out).toMatch(/First paragraph\./)
  expect(out).toMatch(/Second paragraph\./)
})
