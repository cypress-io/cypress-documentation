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
- Never install Cypress that is already declared. Running `add -D cypress` on a
  repo whose `package.json` already lists it resolves to the latest version and
  rewrites the declared range — a silent major upgrade. Use the manager's plain
  install instead, so the declared range is honoured. See phase 2.
- Never start a recorded run yourself. Verification uses `cypress run` without
  `--record`. The record key is not part of your job — if someone does paste a
  command containing one, use it only as a command argument and never write it to
  `cypress.config.*`, `cypress.env.json`, `.env`, a shell profile, a CI file, or
  any other file.

## 1. Detect

Read only — change nothing in this phase. Gather all of it before deciding
anything.

- **The repo, and the directory you will work in.** Confirm the repository root
  and its git remote, and state them. Then state the single directory you will
  install and run from, and confirm it is a package root — it holds the
  `package.json` that declares Cypress. Everything below is relative to that
  directory, and phase 5 has to name it. If the working tree already has
  uncommitted changes, say so, because your edits will mix with the person's.
- **The package manager.** Take it from the lockfile, not from habit.
- **Cypress — establish three separate facts.** They can disagree, and which
  action is correct depends on which of them is true. Run the commands; do not
  infer.

  1. **Declared** — is `cypress` in `dependencies` or `devDependencies`, and at
     what range? Read the `package.json` in your operating directory.
  2. **Resolvable** —
     `node -e "console.log(require.resolve('cypress/package.json'))"`. Print the
     path and state it. A path outside the package you are configuring means
     Cypress is inherited from a parent directory, not installed here.
  3. **Binary present** — `npx --no-install cypress version`, which reports the
     package version and the binary version separately. The package can be
     installed while the binary is not.

  Do not substitute `ls node_modules`, `which cypress`, or the absence of a local
  `node_modules` for any of these. Node resolves modules by walking _up_ the
  directory tree, so Cypress can be entirely absent from the directory you are
  standing in and still resolve from a parent — which happens routinely in
  monorepo packages, git worktrees, and any repo checked out inside another
  package. Those proxies report "not installed" for a repo that has Cypress, and
  installing on top of that is how you cause the version change the hard rules
  forbid.

- **The config file.** Look for `cypress.config.js`, `.ts`, `.mjs`, `.cjs` — and
  for a legacy `cypress.json`, which means Cypress 9 or older.
- **An existing project ID.** Check the config, `cypress.env.json`, and the
  `CYPRESS_PROJECT_ID` environment variable.
- **Existing specs.** Use `specPattern` from the config if it is set; otherwise
  `cypress/e2e/**`, and `cypress/integration/**` for older layouts.
- **Testing types.** Note whether the config defines `e2e`, `component`, or both.
- **Workspace layout.** In a monorepo, work out which single package should own
  Cypress.

Package manager, by lockfile. The second command matters: it installs what the
lockfile already pins, without changing any declared version.

- `pnpm-lock.yaml` — add with `pnpm add -D cypress`, plain install
  `pnpm install`
- `yarn.lock` — add with `yarn add -D cypress`, plain install `yarn install`
- `package-lock.json` — add with `npm install -D cypress`, plain install
  `npm ci`
- `bun.lockb` — add with `bun add -d cypress`, plain install `bun install`
- No lockfile — add with `npm install -D cypress`; there is nothing to honour

Using the wrong manager writes a second lockfile alongside the first, which can
break the person's CI. If an install fails, report the output — do not retry
with a different manager.

## 2. Decide

Work out the whole plan before you touch anything, so that a "no" never leaves
the repo half-configured.

### Cypress

Cross the two facts from phase 1. "Install only if it is missing" is not
specific enough: two of these four cases are not an install at all, and one of
them is destructive if you treat it as one.

- **Declared, and resolvable.** Nothing. Report the version and move on.
- **Declared, not resolvable.** Dependencies are simply not installed. Run the
  manager's plain install from the phase-1 list — never `add -D cypress`, which
  would resolve to the latest version and rewrite the declared range.
- **Not declared, but resolvable from inside the repository.** Cypress comes
  from a parent package or a workspace root. Say where it resolved from, and
  ask. Declaring it here is usually right, but it is the person's call, and some
  repos leave it undeclared deliberately.
- **Not declared, and resolvable only from outside the repository root.** A path
  like `~/node_modules/cypress` is a stray global install, never a deliberate
  architecture choice, and asking whether to declare Cypress "here" makes no
  sense. Treat it as not present, say what you found and where, and install
  without asking.
- **Neither.** Install it, using the add command from the phase-1 list.

Separately, if Cypress is resolvable but `npx --no-install cypress version`
shows no binary, run `npx cypress install`. That fetches the binary for the
version already declared and does not touch `package.json`.

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

Get Cypress present — whichever of install, plain install, ask, or nothing the
phase-2 list selected. Do not shortcut it to "install if missing".

Set the project ID. If there is no config file, create one. If there is, edit it
in place: add the single `projectId` key and leave every other key, comment, and
formatting choice alone. Do not reformat the file.

Take the config's extension and module syntax from the package, not from this
page. Guessing wrong is a `SyntaxError` on the first run, not a warning:

- **TypeScript already in use** — a `typescript` dependency or a `tsconfig.json`
  — use `cypress.config.ts` with `import` / `export default`.
- **`"type": "module"` in `package.json`** — use `cypress.config.js` with
  `import` / `export default`.
- **No `type` field** — this is the CommonJS default, and what `npm init -y`
  produces. Use `cypress.config.js` with `require` / `module.exports`.

TypeScript, or ESM:

```ts title="cypress.config.ts"
import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'YOUR_PROJECT_ID',
  e2e: {
    // leave any existing options untouched
  },
})
```

CommonJS:

```js title="cypress.config.js"
const { defineConfig } = require('cypress')

module.exports = defineConfig({
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

Scaffold the support file as well, if nothing matches
`cypress/support/e2e.{js,jsx,ts,tsx}`. Cypress expects one by default and
refuses to run without it, and a repo with no specs has no support file either —
so the greenfield path, which is exactly what this page is for, fails
verification unless you create it:

```js title="cypress/support/e2e.js"
// Loaded before every e2e spec. Custom commands and global hooks go here.
```

If you would rather not add the file, set `supportFile: false` in the config's
`e2e` block instead. What you must not do is leave it unset with no file
present.

Ignore Cypress's output. Add these to `.gitignore` if absent:

```text title=".gitignore"
cypress/screenshots/
cypress/videos/
cypress/downloads/
```

If your install created `node_modules` in a repo that has no `.gitignore` at
all, add `node_modules/` too. That looks like it conflicts with "never change
what you did not come to change", so to be explicit: it does not. You created
that directory, and leaving it untracked means the person's next commit carries
their whole dependency tree.

## 4. Verify

Prove the setup works before handing it back. Run one spec locally, without
recording:

```shell
npx cypress run --spec cypress/e2e/cloud-setup.cy.js
```

Point `--spec` at a spec that actually exists: the one you scaffolded, or — if
the repo already had specs and you scaffolded nothing — a single existing one.
`--spec` on a path that is not there fails as "no specs found", which reads like
a broken setup at the very last step.

Installing Cypress and fetching its binary can take several minutes; seven is
not unusual on a cold cache. That is not a hang. Do not kill it and retry.

Do not hand off a setup that does not pass — fix it, or report the failure with
the output.

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

- **No `package.json`.** Two different situations, and only one of them is a
  stop:
  - **An empty or near-empty repo** — often someone creating a fresh one
    specifically to try Cypress Cloud. That is a good candidate, not a dead end.
    Offer to bootstrap it with `npm init -y`, and say so before you do:
    creating `package.json` is a bigger change than the three this job is
    scoped to, so it is the person's call.
  - **A repo built on another stack** — a `go.mod`, `pyproject.toml` or
    `Gemfile` and no JavaScript package. Stop, and point the person at the
    manual setup guide.
- **Cypress 9 or older.** Ask before migrating — see phase 2.
- **An ambiguous monorepo.** Ask which package should own Cypress.
- **A failed install.** Report the manager's own output. Do not work around it.

Running this twice is safe, but only because phase 1 detects by resolution
rather than by looking for a local `node_modules`. A second pass on an
already-configured repo lands in the declared-and-resolvable case, changes
nothing, and says so. If you substitute a proxy check, that guarantee is gone:
every pass reads "not installed" and installs again.
