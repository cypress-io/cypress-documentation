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
    `title` (see the alt-text guidance below).
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

### Tabs

`<Tabs>` and `<TabItem>` are globally available via `src/theme/MDXComponents.js`
— **no import needed** in `.mdx`. Use a shared `groupId` so a reader's choice
syncs across every tab group on the page (and is remembered between visits).

Established conventions — match them so selections stay in sync:

- **Package-manager commands** (install / CLI): one tab per manager with
  `groupId="package-manager"` and `defaultValue="npm"`. Order is always
  **npm → Yarn → pnpm** (labels `npm`, `Yarn`, `pnpm`). Reach for the shared
  `docs/partials/_cypress-install-commands.mdx` partial when showing the basic
  install rather than re-authoring it.

  ````mdx
  <Tabs groupId="package-manager" defaultValue="npm" values={[
    {label: 'npm', value: 'npm'},
    {label: 'Yarn', value: 'yarn'},
    {label: 'pnpm', value: 'pnpm'},
  ]}>
    <TabItem value="npm">

  ```shell
  npm install cypress --save-dev
  ```

    </TabItem>
    <TabItem value="yarn">

  ```shell
  yarn add cypress --dev
  ```

    </TabItem>
    <TabItem value="pnpm">

  ```shell
  pnpm add --save-dev cypress
  ```

    </TabItem>
  </Tabs>
  ````

- **TypeScript / JavaScript examples.** Prefer **not** to hand-write a JS tab.
  Author a single TypeScript block tagged `copyTsToJs` and the `copyTsToJs`
  remark plugin generates the JavaScript version automatically, **JS tab first,
  then TS**:

  ````mdx
  ```typescript copyTsToJs
  const name: string = 'joe'

  export default name
  ```
  ````

  Only fall back to explicit `<Tabs>` with separate `.js`/`.ts` `<TabItem>`s
  when the two versions differ by more than types (e.g. a `declare global`
  block) and the plugin can't derive one from the other. When you do, keep the
  **JS tab first**.

- **Frameworks:** use `groupId="frameworks"`, ordered **React → Angular → Vue →
  Svelte**.

The TabItem **order is a convention, not enforced** by Docusaurus — keep it
consistent with the lists above. `groupId`/`defaultValue` are what actually
drive syncing and the initial selection.

### Cypress config examples (`:::cypress-config-example`)

Whenever you show a snippet of Cypress configuration, **do not hand-write the
full `cypress.config` file or its tabs.** Use the `:::cypress-config-example`
remark directive (handled by `plugins/cypressRemarkPlugins`) and write only the
config _object_. The plugin wraps it in `defineConfig()`, generates both the
TypeScript and JavaScript forms, and renders them in synced
`CypressConfigFileTabs` (JS tab first). This keeps every config example on the
site consistent — boilerplate, import style, and TS/JS parity are all generated.

````markdown
:::cypress-config-example

```ts
{
  e2e: {
    baseUrl: 'http://localhost:1234',
  },
}
```

:::
````

Notes:

- One code block = the object passed to `defineConfig()`. Supply **two** blocks
  when you also need code _above_ `defineConfig` (e.g. imports): the first block
  goes after the imports, the second is the config object.
- For documenting a **plugin's** `setupNodeEvents` usage, use the sibling
  directive `:::cypress-config-plugin-example` instead — one block goes inside
  `setupNodeEvents`, or two blocks for imports + `setupNodeEvents` body.
- Write the inner block as `ts`; the JS equivalent is produced automatically via
  the `copyTsToJs` plugin, so never maintain a JS copy by hand.

### Writing accessible image alt text

`alt` text is read aloud by screen readers and shown when an image fails to
load, so write it to convey the image's _purpose_, not just its existence.

- **Describe the meaning, not the medium.** Convey what the image shows in
  context. Avoid filler like "image of", "screenshot of", or "picture of" — the
  screen reader already announces it as an image.
- **Be specific and concise.** Aim for roughly one sentence (~125 characters).
  If a screenshot needs a long explanation, put that detail in the surrounding
  prose and keep `alt` short.
- **Capture the salient detail.** For a UI screenshot, name what the reader is
  meant to notice (e.g. the failing command, the highlighted button), not every
  element on screen.
- **Don't repeat nearby text.** If an adjacent caption or sentence already
  states what the image shows, don't duplicate it word-for-word in `alt`.
- **Include text shown in the image** when that text matters to understanding
  it (e.g. an error message or a specific config value).
- **Decorative images get empty alt** (`alt=""`) so screen readers skip them —
  but in these docs images are almost always meaningful, so this is rare.
- **`title` vs `alt`:** `alt` is the accessible description; `title` is a short
  caption/tooltip. They can differ — don't just copy one into the other.

Examples:

```jsx
<!-- weak -->
<DocsImage src="/img/app/test-runner.png" alt="screenshot" title="Test Runner" />

<!-- better -->
<DocsImage
  src="/img/app/test-runner.png"
  alt="Cypress Test Runner showing a failed cy.get assertion highlighted in red in the command log"
  title="Inspecting a failed command"
/>
```

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

### Linking to other Cypress domains (UTM params)

Outbound links to **Cypress marketing / product properties** carry UTM tracking
query params so the team can attribute traffic from the docs. Add them when you
link to `www.cypress.io`, `on.cypress.io`, or `learn.cypress.io`.

Required params (order them `utm_source` → `utm_medium`, then optional content):

- `utm_source=docs.cypress.io` — always this exact value.
- `utm_medium=<placement>` — a short kebab-case description of _where this
  specific link lives_, not the destination. Reuse an existing value when one
  fits; examples in the repo: `intro-cta`, `get-started-page`, `cloud-benefits`,
  `premium-solution-tip`, `enterprise-reporting`, `app-docs-a11y-article`,
  `footer`, `nav`, `announcement-bar`.
- `utm_content=<Label>` — optional but common; mirrors the link/button text or
  action, e.g. `Request+trial`, `Cypress+Cloud`, `Schedule a demo`
  (URL-encode spaces as `+` or `%20`).
- `utm_campaign` — only for a major launch/campaign (e.g. `cloud-mcp`); omit
  otherwise. `utm_term` is effectively unused — leave it out.

```markdown
[Request a trial](https://www.cypress.io/accessibility?utm_medium=intro-cta&utm_source=docs.cypress.io&utm_content=Request+trial)
```

Do **not** add UTM params to internal doc-to-doc links, to `cloud.cypress.io`
sign-up/login links, or to non-Cypress third-party links. For repeated CTAs,
prefer the shared partials (e.g. `docs/partials/_ui-coverage-premium-note.mdx`)
that already embed the correct params rather than re-writing the URL.
