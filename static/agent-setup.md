# Cypress Cloud Agent Setup

This page is read by an AI coding agent working inside someone's repository. It
is linked from the prompt in Cypress Cloud's onboarding guide, which asks an
agent to get a repo ready to record its first run. Follow the phases in order.

## Who does what

- **Cypress Cloud** supplies two separate things: the prompt, which carries the
  project ID and a link to this page, and the record command, which carries the
  record key.
- **The person** pastes the prompt to their agent. Reviews the diff afterwards.
  Runs the record command themselves, in their own terminal.
- **The agent** does everything on this page: detect, decide, apply, verify, hand
  back. Gets the project ID. Does not get the record key, and does not run the
  recorded run.

Keep that boundary. The setup work and the recorded run are deliberately two
steps performed by two different parties, and the record key never needs to
cross into the agent's half.

## Hard rules

You are operating in a repository you did not write, which may be someone's
production codebase. The whole job is three small changes — a dev dependency,
one config key, and possibly one spec file. Anything beyond that is out of
scope.

- Never commit or push. Leave every change in the working tree for the person to
  review.
- Never change what you did not come to change. Do not add, upgrade, downgrade,
  or remove any other dependency. Do not touch CI configuration, build config,
  existing tests, or any config key other than `projectId`.
- Never overwrite an existing `projectId` without asking first. Replacing one
  sends an established repo's runs to a different Cloud project. See phase 2.
- Never install Cypress into more than one package. In a monorepo, pick one and
  say which.
- Never start a recorded run yourself. Verification uses `cypress run` without
  `--record`. The record key is not part of your job — if someone does paste a
  command containing one, use it only as a command argument and never write it to
  `cypress.config.*`, `cypress.env.json`, `.env`, a shell profile, a CI file, or
  any other file.

## 1. Detect

Read only — change nothing in this phase. Gather all of it before deciding
anything.

- **The repo.** Confirm the repository root and its git remote, and state them.
  If the working tree already has uncommitted changes, say so, because your edits
  will mix with the person's.
- **The package manager.** Take it from the lockfile, not from habit.
- **Cypress.** Is `cypress` in `dependencies` or `devDependencies`? Is it
  actually installed? Note the version.
- **The config file.** Look for `cypress.config.js`, `.ts`, `.mjs`, `.cjs` — and
  for a legacy `cypress.json`, which means Cypress 9 or older.
- **An existing project ID.** Check the config, `cypress.env.json`, and the
  `CYPRESS_PROJECT_ID` environment variable.
- **Existing specs.** Use `specPattern` from the config if it is set; otherwise
  `cypress/e2e/**`, and `cypress/integration/**` for older layouts.
- **Testing types.** Note whether the config defines `e2e`, `component`, or both.
- **Workspace layout.** In a monorepo, work out which single package should own
  Cypress.

Package manager, by lockfile:

- `pnpm-lock.yaml` — use `pnpm add -D cypress`
- `yarn.lock` — use `yarn add -D cypress`
- `package-lock.json` — use `npm install -D cypress`
- `bun.lockb` — use `bun add -d cypress`
- No lockfile — use `npm install -D cypress`

Using the wrong manager writes a second lockfile alongside the first, which can
break the person's CI. If an install fails, report the output — do not retry
with a different manager.

## 2. Decide

Work out the whole plan before you touch anything, so that a "no" never leaves
the repo half-configured.

### The project ID

What you found, and what to do about it:

- **No project ID anywhere.** Add the one from the prompt.
- **The same ID as the prompt's.** Nothing. Report that it is already set and
  move on.
- **A different ID.** Stop and ask. Show both values and explain that replacing
  it sends this repo's runs to a different Cloud project. Wait for an answer.
- **`CYPRESS_PROJECT_ID` set in the environment.** It overrides the config at
  runtime. Update the config as normal, and say that the variable must be unset
  or changed to match.

### When to ask before applying

Ask first if any of these is true. Otherwise go ahead and report afterwards.

- An existing project ID differs from the prompt's.
- More than one package could reasonably own Cypress.
- The repo only has a legacy `cypress.json` — migrating to Cypress 10+ is a
  bigger change than this setup, and the person should choose it deliberately.
- The repo has component tests but no e2e tests. The record command runs e2e by
  default, so the person needs to know it will need `--component`.

## 3. Apply

Install Cypress — only if it is missing, using the manager from phase 1.

Set the project ID. If there is no config file, create one. If there is, edit it
in place: add the single `projectId` key and leave every other key, comment, and
formatting choice alone. Do not reformat the file.

```ts title="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'YOUR_PROJECT_ID',
  e2e: {
    // leave any existing options untouched
  },
})
```

Scaffold a spec — only if the repo has none.

```js title="cypress/e2e/cloud-setup.cy.js"
describe('Cypress Cloud setup', () => {
  it('records a run to Cypress Cloud', () => {
    cy.wrap('cypress').should('equal', 'cypress')
  })
})
```

This spec deliberately does not visit a URL. A scaffolded `cy.visit('/')` fails
when no application is running and no `baseUrl` is set, which would make the
person's very first recorded run a red one. Only write a `cy.visit` test instead
if `baseUrl` is already configured and you have confirmed the server runs.

Ignore Cypress's output. Add these to `.gitignore` if absent:

```text title=".gitignore"
cypress/screenshots/
cypress/videos/
cypress/downloads/
```

## 4. Verify

Prove the setup works before handing it back. Run the spec locally, without
recording:

```shell
npx cypress run --spec cypress/e2e/cloud-setup.cy.js
```

The first run downloads the Cypress binary, which can take a minute. Do not hand
off a setup that does not pass — fix it, or report the failure with the output.

## 5. Hand back

Your half is done and the next step is the person's. This is the moment the
whole setup exists for, so be specific: say what you changed, say exactly where
to get the command, and say which directory to run it from. Do not run it for
them.

Report it like this, filling in what you actually did:

```text
Cypress is set up to record to Cypress Cloud.

  Cypress   installed 15.4.0 (was not present)
  Config    cypress.config.ts — added projectId "abc123"
  Spec      cypress/e2e/cloud-setup.cy.js — created
  Ignored   cypress/screenshots, cypress/videos, cypress/downloads
  Verified  1 passing (cypress run, not recorded)

Please review the diff before going further.

To record your first run:

  1. Go back to Cypress Cloud, to the onboarding guide you copied the prompt from.
  2. Under "Paste command into terminal", copy the command.
  3. Run it from ./apps/web — that is where I installed Cypress.

That command contains your record key. Run it; don't save it in a file. If you
want it again later, export CYPRESS_RECORD_KEY in your shell session rather
than committing it anywhere.

The guide picks the run up on its own and moves you on to reviewing the
results — you don't need to refresh it.
```

Three details in there are not optional:

- **Name the directory.** The command has to run where Cypress is installed. In a
  monorepo, the repo root is usually the wrong answer, and `npx cypress run` from
  the wrong directory fails in a way that looks like a broken setup rather than a
  wrong path.
- **Say the guide updates itself.** Otherwise people sit on the page reloading it,
  or assume nothing happened.
- **If the repo only has component tests**, add that the command needs
  `--component` — this is the point where it matters, not phase 2.

## When to stop

- **No `package.json`.** This is not a JavaScript project. Stop and point the
  person at the manual setup guide.
- **Cypress 9 or older.** Ask before migrating — see phase 2.
- **An ambiguous monorepo.** Ask which package should own Cypress.
- **A failed install.** Report the manager's own output. Do not work around it.

Running this twice should be safe. Every phase checks before it writes, so a
second pass on an already-configured repo should change nothing and say so.
