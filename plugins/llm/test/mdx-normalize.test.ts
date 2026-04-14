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
  expect(out).toMatch(/\(\/app\/core-concepts\/introduction-to-cypress#Chains-of-Commands\)/)
  expect(out.includes('\\[')).toBe(false)
})
