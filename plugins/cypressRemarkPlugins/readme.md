# Cypress Remark Plugins for Docs

This "package" contains a few remark plugins for creating and populating content
variations in Tabs/code-blocks for Cypress config samples.

This is developed as a separate package so it can be in TS and have its own
tests/builds outside of the main docs.

Note that this package is never installed on its own — it has no lockfile and
is not an npm workspace, and the `npm --prefix` build/test scripts only run
its scripts. All of its dependencies (typescript, prettier, unist-util-visit,
vitest, etc.) resolve from the repository root's `node_modules`, so declare
any new dependency in the root `package.json`.

To build, from the _project root_ run `npm run build:plugins`

To test, from the _project root_ run run `npm run test:plugins`

Visit each plugins readme for docs on each individual plugin.
