# Agent rules: partials

The root [`AGENTS.md`](../../AGENTS.md) still applies; this file adds the rules
specific to `docs/partials/`, the shared MDX fragments rendered inside other
pages. Reasoning lives in
[`AGENTS_REFERENCE.md`](../../AGENTS_REFERENCE.md#partials).

## What belongs here

A partial earns its indirection only by being rendered in **more than one
place**. Before adding one, check that at least two pages will use it. Before
removing the second-to-last reference to an existing one, inline it into the
remaining page and delete the file.

```shell
# which pages render <CloudFreePlan />?
grep -rl "CloudFreePlan" docs --include="*.mdx"
```

## Writing one

- Name it `_kebab-case.mdx`. The leading underscore is what keeps Docusaurus
  and `scripts/lint-frontmatter.js` from treating it as a page, so it is not
  optional.
- No frontmatter and no H1. A partial is a fragment, not a page.
- It inherits the host page's MDX scope, so every component registered in
  `src/theme/MDXComponents.js` is available with no import.
- Headings inside a partial are the one place a custom `{#Anchor}` id is
  correct. The host page cannot rename them, so the explicit id is what keeps
  inbound links stable (see `_header-yields.mdx`).

## Registering one

Partials are used as global components (`<CloudFreePlan />`) with no per-page
import, which takes two edits to `src/theme/MDXComponents.js`: the import
**and** the name in the exported object. Miss the second and the component
renders as literal text.

```js
import CloudFreePlan from '@site/docs/partials/_cloud_free_plan.mdx'
// ...then add `CloudFreePlan,` to the exported object below.
```

Deleting a partial means deleting the registration in the same PR.

## Partials that supply a page's headings

When a partial provides most of a page's content, its headings are missing from
the right-hand table of contents unless the page re-exports them:

```jsx
import { toc as viewsToc } from '@site/docs/partials/_views.mdx'

export const toc = [
  ...viewsToc,
  { value: 'See also', id: 'See-also', level: 2 },
]
```

See `docs/accessibility/configuration/views.mdx` for the full pattern.
