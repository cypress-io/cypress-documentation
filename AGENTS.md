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
  (name, description, repo link, keywords).
- Header anchor casing is intentionally preserved via a `patch-package` patch to
  `@docusaurus/mdx-loader` (see `patches/`) — this is expected, not a bug.

## PR & branch conventions

- Documentation changes **not** tied to a release → target `main`.
- Documentation for **unreleased** features → target the matching
  `X.Y.Z-release` branch (merged into `main` at release time).
- Reference issues with `closes #NNN` in the PR description.

## CI & deployment

- **CircleCI** runs the build and checks on PRs and the `main` branch.
- **Netlify** builds a deploy preview for every PR (and a branch preview at
  `https://$BRANCH_NAME--cypress-docs.netlify.app`); merges to `main` publish to
  [docs.cypress.io](https://docs.cypress.io).
