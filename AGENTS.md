# Repository Guide for AI Agents

This file gives AI coding agents (Claude Code, Cursor, etc.) the context needed
to make good changes to this repository. Keep it short and current.

## Project

This is the **Cypress Documentation** site, built with
[Docusaurus 3](https://docusaurus.io/) in TypeScript.

- Docs content lives in `docs/**/*.mdx`.
- Custom remark plugins live in `plugins/cypressRemarkPlugins`.
- The LLM-docs pipeline lives in `plugins/llm`. At build time it reprocesses
  content into stripped-down markdown and chunked JSON published under `/llm`,
  with `/llms.txt` as the index (both are build output, not committed files).
- Reusable React/MDX components live in `src/components` and are registered in
  `src/theme/MDXComponents.js`.

## Key commands

```bash
npm i                 # install (runs patch-package via postinstall)
npm run start         # local dev server with live reload
npm run build         # production build into dist/ (also rebuilds plugins)
npm run lint          # Prettier check on **/*.{md,mdx}
npm run lint:fix      # Prettier autofix
npm run typecheck     # tsc
npm test              # cypress run (e2e)
npm run test:plugins  # vitest unit tests for the plugins
```

**Always run `npm run lint:fix` before committing.** A Husky + lint-staged
pre-commit hook formats `*.{md,mdx}` with Prettier, and CI fails on unformatted
files.

## Content authoring conventions

See `CONTRIBUTING.md` for full detail. The essentials:

- Prefer the provided MDX components over raw HTML:
  - `<DocsImage src="/img/..." alt="..." title="..." />` — always set `alt` and
    `title` for accessibility.
  - `<DocsVideo src="..." title="..." />` — supports local files, YouTube, Vimeo.
  - `<Icon name="..." />` — the Font Awesome icon must be imported under the
    `fontawesome` key in `src/theme/MDXComponents.js`.
- Images go in `static/img/...` and are referenced via `/img/...`.
- Reuse repeated content via Markdown partials (imported `.mdx`).
- To add a plugin to the plugins list, add an entry to `src/data/plugins.json`
  (name, description, repo link, keywords). Entries are grouped in this order:
  `official` (Cypress-owned) → `verified` (community, verified by Cypress) →
  `community` (unverified) → `deprecated` (unmaintained / incompatible with v10+).
- Header anchor casing is intentionally preserved via a `patch-package` patch to
  `@docusaurus/mdx-loader` (see `patches/`) — this is expected, not a bug.

## Linking

`onBrokenLinks` and `onBrokenMarkdownLinks` are both set to `throw`, so a broken
link **fails the build**. Get the path and the anchor casing exactly right.

### Linking to another doc

Use an **absolute site path** rooted at the section, **without** the `.mdx`
extension — not a relative file path:

```markdown
<!-- correct -->

[`cy.origin()`](/api/commands/origin)
[support file](/app/references/configuration)

<!-- avoid -->

[support file](../app/references/configuration.mdx)
```

Sections map to the top-level `docs/` folders: `/api/...`, `/app/...`,
`/cloud/...`, `/accessibility/...`, `/ui-coverage/...`.

### Linking to a heading (anchor / hash link)

Anchor IDs **preserve the heading's original casing** (because of the
`mdx-loader` patch above) and replace spaces with hyphens. This is the part that
most often breaks the build — do **not** lowercase the anchor.

```markdown
<!-- heading: ## Disabling Web Security -->

[disable web security](/app/guides/cross-origin-testing#Disabling-Web-Security)

<!-- same-page link to ### Yields -->

[what it yields](#Yields)
```

Rules for building the hash:

- Keep the exact case of the heading text: `## File Opener Preference` →
  `#File-Opener-Preference` (not `#file-opener-preference`).
- Replace spaces with hyphens.
- Version-number headings replace dots with dashes: `## 14.0.0` → `#14-0-0`.
- **Avoid custom heading anchors.** Prefer the auto-generated, case-preserved
  anchors above. Only fall back to an explicit `{#CustomId}` at the end of a
  heading in the rare cases where the regular casing-based reference does not
  work (see the `docs/partials/_header-*.mdx` files, e.g. `{#Yields}`).
- `npm run write-heading-ids` generates explicit IDs for headings if you want
  them materialized.
