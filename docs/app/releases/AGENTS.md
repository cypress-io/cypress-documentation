# Agent rules: Cypress app release docs

The root [`AGENTS.md`](../../../AGENTS.md) still applies; this file adds the
rules specific to `docs/app/releases/`. Three pages live here, and each sets a
`slug` that differs from its file path, so link the route, not the folder:

| File                  | Route                             |
| --------------------- | --------------------------------- |
| `changelog.mdx`       | `/app/references/changelog`       |
| `migration-guide.mdx` | `/app/references/migration-guide` |
| `release-stages.mdx`  | `/app/references/release-stages`  |

## Changelog entries

Newest release first, directly under the `# Changelog` H1:

```markdown
## 16.1.0

_Released Sep 15, 2026_

**Features:**

- Added the [`trustedCertificates`](/app/references/configuration#trustedCertificates)
  configuration option. Addresses [#34760](https://github.com/cypress-io/cypress/issues/34760).
```

- The H2 is the bare version, no `v` prefix. Its anchor turns the dots into
  hyphens (`## 16.1.0` is `#16-1-0`), which is what API `## History` tables and
  other entries link to.
- `_Released Mon D, YYYY_` on its own line, italic, no zero padding on the day.
- Group bullets under bold labels, in this order, using only the groups the
  release has: **Summary**, **Breaking Changes**, **Deprecations**,
  **Performance**, **Features**, **Bugfixes**, **Misc**, **Dependency Updates**.
  Don't invent a new label when an existing one fits.
- Every bullet links the issue or PR it came from: `Fixes [#34778](…/issues/34778).`
  for a reported issue, `Addressed in [#34762](…/pull/34762).` for a PR.
- A regression links the release that introduced it:
  `Fixed a regression in [16.0.0](#16-0-0) where …`. That backlink is how a
  reader finds the change that caused their problem, so it is worth the lookup.
- Write what the reader observes, not the internal fix. Name the affected
  browsers, config options, and commands, and link each one's docs page.

## Alongside a changelog entry

- A behavior change documented on an API page needs a row in that page's
  `## History` table, pointing back at this anchor.
- A major version needs a `migration-guide.mdx` section.
- Open the PR from a `releases/*` branch and use the release template
  (`?template=release.md`). See the root `AGENTS.md`.

## The other changelogs

`docs/accessibility/changelog.mdx` and `docs/ui-coverage/changelog.mdx` are
continuously delivered, so they use `## Week of Mon D, YYYY` with a flat bullet
list and no version numbers or group labels. `docs/cloud/releases/changelog.mdx`
holds no entries at all; it points to the Cypress releases page. Don't
cross-apply the format on this page to any of them.
