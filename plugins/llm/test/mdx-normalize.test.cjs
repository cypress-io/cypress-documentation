const { test } = require('node:test')
const assert = require('node:assert/strict')
const { normalizeContent } = require('../dist/mdx-normalize.js')

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
  assert.match(out, /^# Title/m)
  assert.equal(out.includes('ProductHeading'), false)
  assert.match(out, /\| One \| Two \|/)
})

test('partials: replaces PascalCase component with markdown body', () => {
  const src = `# Doc

<InlinePartial />

After.
`
  const out = normalizeContent('', src, { InlinePartial: '## Injected\n\nBody.' })
  assert.match(out, /# Doc/)
  assert.match(out, /## Injected/)
  assert.match(out, /Body\./)
  assert.equal(out.includes('<InlinePartial'), false)
  assert.match(out, /After\./)
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
  assert.equal(out.includes('leaked'), false)
  assert.match(out, /OK/)
})

test('Docusaurus {#heading-id} strips so MDX parses; Icon in link → (title)', () => {
  const src =
    '### Requirements [<Icon name="question-circle" title="Learn about chaining commands"/>](/app/core-concepts/introduction-to-cypress#Chains-of-Commands) {#Requirements}\n'
  const out = normalizeContent('docs/partials/_header-requirements.mdx', src, null)
  assert.equal(out.includes('{#Requirements}'), false)
  assert.equal(out.includes('<Icon'), false)
  assert.match(out, /\(Learn about chaining commands\)/)
  assert.match(out, /introduction-to-cypress#Chains-of-Commands/)
  assert.equal(out.includes('\\['), false, 'heading links must stay as mdast links, not escaped text')
})
