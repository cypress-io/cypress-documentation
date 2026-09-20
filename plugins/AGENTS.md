# Agent rules: plugins

The root [`AGENTS.md`](../AGENTS.md) still applies; this file adds the rules
specific to `plugins/`. Reasoning lives in
[`AGENTS_REFERENCE.md`](../AGENTS_REFERENCE.md#project-layout).

Two kinds of thing live here, and they behave differently:

- **Loose `.js` files** (`faq-structured-data.js`, `og-image-cards.js`,
  `osano.js`, `fav-icon.js`, `fullstory.js`) are plain Docusaurus plugins,
  loaded straight from `docusaurus.config.js`. No build step.
- **`cypressRemarkPlugins/` and `llm/`** are TypeScript sub-packages that
  compile to a gitignored `dist/`. Everything below is about these two.

## Dependencies go in the root `package.json`

The sub-packages are **never installed on their own**. They have no lockfile
and are not npm workspaces; the root's `npm --prefix … run build` only runs
their scripts. Every dependency (typescript, vitest, the remark/unist
ecosystem) resolves from the repository root's `node_modules`, which is why
their own `package.json` files declare no `dependencies` at all. A pin added to
one of them is never installed and only drifts stale, so declare new
dependencies in the **root** `package.json`.

## They must be built before they run

`dist/` is gitignored, so a fresh clone has none. Source edits do nothing until
you rebuild:

```shell
npm run build:plugins   # tsc for both sub-packages
```

`npm run build` does this first via `prebuild`, and `npm run start` runs
`scripts/checkRemarkPluginsBuild.js` via `prestart`. Neither notices a **stale**
`dist`, so rebuild after editing rather than trusting the dev server.

## Verifying a change

- `npm run test:plugins` runs the vitest suites in both sub-packages plus the
  FAQ plugin test.
- `npm run build` is the real check for `cypressRemarkPlugins`: it backs the
  `:::cypress-config-example`, `:::cypress-config-plugin-example`, and
  `:::visit-mount-example` directives and the `copyTsToJs` code-block flag, so a
  change there reprocesses every page that uses them.
- For `llm/`, build and then look at the output it owns: `dist/llm/markdown/`,
  `dist/llms.txt`, `dist/llms-full.txt`, and `dist/docs-manifest.json`. A grep
  over `dist/llm/markdown/` is also how you confirm `data-sanitize` stripped the
  interactive chrome it was meant to.
