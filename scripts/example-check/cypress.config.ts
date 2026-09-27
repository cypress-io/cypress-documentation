// Template for the code example harness. Copy this folder to .example-check/
// and edit the copy, never this file. See
// AGENTS_REFERENCE.md#verifying-code-examples.
import { defineConfig } from 'cypress'

// A config example from the docs replaces the empty object. See Step 5.
const example: Cypress.ConfigOptions =
  // --- example (verbatim) ---
  {}
// --- end example ---

// The harness settings, kept apart from the example so an example that sets
// its own `e2e` merges with them instead of colliding.
const base: Cypress.ConfigOptions = {
  video: false,
  screenshotOnRunFailure: false,
  fixturesFolder: false,
  // Off so a flaky example fails instead of passing on a retry.
  retries: 0,
  e2e: {
    supportFile: false,
  },
}

export default defineConfig({
  ...base,
  ...example,
  e2e: { ...base.e2e, ...example.e2e },
})
