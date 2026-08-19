# Draft: Cypress 16 migration prompt

This file is not published. Docusaurus ignores files whose name starts with `_`.

## How to use it

Paste the `<CopyPrompt />` block below into
`docs/app/references/migration-guide.mdx`, immediately after the
`## Migrating to Cypress 16.0` heading and before the intro paragraph, matching
the placement used for Cypress 15, 14, 13, 12, 11, and 10. Then delete this
file.

Do this once the 16.0 migration guide is content-complete, because the prompt
tells the assistant to read the guide's own LLM export at
`https://docs.cypress.io/llm/markdown/app/references/migration-guide/migrating-to-cypress-16-0.md`.
That URL is generated at build time from the `## Migrating to Cypress 16.0`
section (see `plugins/llm/src/SectionMarkdownExporter.ts`), so it only resolves
once the docs are deployed. Confirm it returns the finished section before
shipping the prompt.

Before pasting, re-check these against the final guide, since the prompt names
them explicitly rather than deferring to the page:

- the supported Node.js range
- the component testing minimums (Angular, Vite, Next.js)
- the list of removed APIs and renamed configuration options

## The block to paste

```text
<CopyPrompt
  defaultCollapsed
  excludeFromLlmExport
  title="Upgrade to Cypress 16 with your AI assistant"
  prompt={`Read https://docs.cypress.io/llm/markdown/app/references/migration-guide/migrating-to-cypress-16-0.md, then upgrade this project from Cypress 15 to 16 by working through these steps:\n\n1. Confirm the starting point. If the project isn't on Cypress 15.x yet, stop and tell me; majors should be upgraded one at a time. Note the exact version I'm on, since some 16.0 replacements (cy.env(), Cypress.expose()) are available in 15.x and can be migrated before the upgrade.\n\n2. Check requirements. Verify my environment meets the requirements in that section and flag anything unsupported before changing any code: Node.js 22.x, 24.x, or 26+; and if I use component testing, Angular 21+, Vite 8+, and Next.js 15.0.4+ or 16+. Upgrading those frameworks is my project's work, not Cypress's — tell me what needs to move and stop if I'm below a minimum.\n\n3. Update Cypress. Detect my package manager and update the cypress dependency to 16.x. If I depend on @cypress/angular-zoneless, replace it with @cypress/angular and update the imports.\n\n4. Remove the APIs that no longer exist. Delete every cy.end() call — nothing replaces them, a new cy.<command>() already starts a new chain. Migrate every Cypress.env() read: sensitive values (keys, tokens, passwords, credentials) to cy.env(), which is asynchronous and yields only the keys you request, and public values (feature flags, API versions, public URLs) to Cypress.expose() with a top-level expose block in my config. Replace any env key in a per-test or per-suite config override with expose. Check for --env CLI flags and plugins that read Cypress.env(). Convert any .coffee specs, support files, or fixtures to JavaScript or TypeScript.\n\n5. Update config options that were renamed or removed. Remove allowCypressEnv and experimentalSourceRewriting. If experimentalSourceRewriting was working around Subresource Integrity errors, set removeSRIAttributes: true instead. Replace experimentalMemoryManagement: false with manageBrowserMemory: false — deleting it without the replacement silently opts me into memory management. Remove experimentalMemoryManagement: true and experimentalFastVisibility entirely; both are now the default.\n\n6. Fix Cypress.config() calls that now throw. Find every Cypress.config() call that sets viewportWidth, viewportHeight, or blockHosts while a test is executing and move it to cy.viewport() or to the test configuration object of the describe, context, or it block.\n\n7. Review what changed behavior without changing my code. Point out, but do not rewrite unless a test actually fails: assertions that read req.httpVersion, content-encoding, content-length, or a 304 status inside cy.intercept(), which the native browser network no longer reports in Chrome, Chromium, and Edge; visibility assertions that depended on the legacy algorithm's ancestor overflow clipping, transform-based hiding, or fixed/sticky coverage detection; tests that relied on the implicit 10ms keystrokeDelay in cy.type(); and cookie or storage assertions written inside .then(), which does not retry — moving them onto .should() is what makes the new query behavior useful. Do not set forceHttp1 or visibilityStrategy: 'legacy' to make a test pass; both are deprecated escape hatches, so flag the test for me instead.\n\n8. Verify. Run npx cypress verify and my Cypress tests, and confirm the run starts with no deprecation or removed-option warnings.\n\nFinish with a summary of what changed and anything you couldn't safely automate.`}
/>
```
