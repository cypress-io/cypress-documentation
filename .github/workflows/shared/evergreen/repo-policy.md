# Evergreen Repo Policy

Confirmed install-time decisions for `cypress-io/cypress-documentation`.

## Merge Gates

- Required checks (branch protection on `main`, non-strict):
  - `ci/circleci: build`
  - `ci/circleci: CSS/Markdown` (the "Lint JS/CSS/Markdown" job: `npm run lint`)
  - `ci/circleci: Install & Persist To Workspace`
  - `ci/circleci: Run Tests in Parallel` (Cypress e2e, 8x parallel, recorded)
  - `license/cla`
  - `netlify/cypress-docs/deploy-preview`
  - `Redirect rules - cypress-docs`
- Non-required checks treated as gates:
  - `ci/circleci: Typecheck` (`npm run typecheck`)
  - `ci/circleci: Algolia, plugins)` (the "Unit Tests (Search/Algolia,
    plugins)" job; CircleCI truncates the context at the last `/`)
- Checks that are not gates: `Cursor Bugbot`, `cypress/flake`,
  `cypress: default-group`, `Header rules - cypress-docs`,
  `Pages changed - cypress-docs`.
- Review requirements: 1 approving review on `main`. Human-owned; not part of
  `evergreen-ready`.
- CODEOWNERS requirements: code-owner review is not required. CODEOWNERS only
  auto-requests review for plugins data files.
- Unresolved thread policy: conversation resolution is required on `main`.
  Human-owned; Evergreen never resolves threads and they are not part of
  `evergreen-ready`.
- Draft PR repair policy: Evergreen may repair labeled draft PRs.
- Draft ready-for-review policy: never. Evergreen does not mark drafts ready.
- Required labels: `evergreen`.
- Active lease label: `evergreen_active` (controller-owned).
- Blocker labels: `evergreen-exhausted` removes the PR from scope.
- Deployment/environment gates: none beyond the Netlify deploy-preview and
  redirect-rules checks listed above.
- Auto-merge behavior: disabled for the repository (`allow_auto_merge: false`),
  so Evergreen cannot indirectly cause a merge.

## Readiness Controller

- Ready label: `evergreen-ready`
- Controller owns ready label: yes
- Add ready label only when: all 9 configured checks report success, neutral,
  or skipped on the current head SHA, the PR is same-repo, open, labeled
  `evergreen`, not exhausted, and has no merge conflict.
- Remove ready label when: any of the above stops being true, including a new
  head SHA.
- Current-head SHA policy: only check results for the current head count.
- Failing check policy: dispatch repair when a configured gate is visibly
  failing for the current head SHA, even if other configured checks are still
  missing or skipped.
- Pending check policy: wait.
- Missing/stale check policy: wait. No deterministic CI activation is
  configured (see CI/CD Activation), so the controller reports `waiting` and a
  later scheduled reconciliation re-evaluates.
- Branch freshness ready criterion: not required (`strict: false`).
- Additional deterministic ready criteria: none. Approvals, conversation
  resolution, and draft state do not block `evergreen-ready`.

## Branch Updates

- Base branch: `main` for most PRs; release work targets `release/*` branches.
- Freshness requirement: none (branch protection is non-strict).
- Branch update policy: controller-owned; the deterministic controller should ask
  GitHub to update the PR branch with an expected head SHA when possible. The
  agent must not run `git merge`, `git rebase`, or include base-branch update
  commits in safe-output patches.
- Rebase or force-push policy: never force-push.
- Fork PR behavior: out of scope (see Trust Model). Merge conflicts on
  same-repo PRs are reported as `blocked`.

## Trust Model

- Repository visibility: public.
- Fork PR policy: fork PRs are accepted by maintainers but are out of scope for
  Evergreen. Preflight classifies them `out_of_scope` and the checkout step
  refuses them. `GITHUB_TOKEN` cannot push to fork branches.
- Are PR branch pushers trusted: yes for same-repo branches (only
  `cypress-io` members with write access can push).
- Default trust level: `trusted-branch` for same-repo PRs; `metadata-only` for
  fork PRs.
- Current-head approval policy: not used. Manual `workflow_dispatch` (write
  access required) may pass `head_sha` to bind a run to a specific head.
- Authorized `/evergreen` users: none; slash commands are not configured.
- What invalidates approval: not applicable; removing `evergreen` stops work.

## Event Fast Paths

- `pull_request` activity types: none.
- Default-branch `push` policy: none; the schedule reconciles `main` changes.
- `workflow_run` policy: none (CI runs on CircleCI, not GitHub Actions).
- Review event policy: none.
- Deployment event policy: none.
- Slash-command policy: none.
- Schedule interval: every 15 minutes, plus manual `workflow_dispatch`. All jobs
  are guarded to `cypress-io/cypress-documentation` on `main` so scheduled runs
  do not fail in forks (see `AGENTS.md`).

## CI/CD Activation

- Workflows/checks Evergreen may rerun: none. CircleCI and Netlify start from
  push webhooks and no CircleCI token is configured.
- Workflows/checks Evergreen may dispatch: none.
- Stale check policy: wait; do not rerun green checks.
- Missing check policy: wait. Evergreen's own pushes to the PR branch trigger
  CircleCI and Netlify through their webhooks.
- Empty commit policy: allowed only as a last resort for a same-repo PR whose
  configured checks never started, using the `evergreen: trigger CI` message.
  It does not count as a semantic repair attempt.
- Token policy: `GITHUB_TOKEN` for everything. No `EVERGREEN_GITHUB_TOKEN` or
  `GH_AW_CI_TRIGGER_TOKEN` is needed because CircleCI and Netlify react to
  `GITHUB_TOKEN` pushes. Copilot inference uses organization billing
  (`copilot-requests: write`), so no `COPILOT_GITHUB_TOKEN` secret is needed.

## Repair Policy

- Allowed edits: documentation content (`docs/**`), site source (`src/**`),
  remark/LLM plugins (`plugins/**`), Cypress specs (`cypress/**`),
  `scripts/**`, and static assets, when the edit clears a configured gate.
  Follow `AGENTS.md` and `AGENTS_REFERENCE.md` for every content edit.
- Protected files (never edit; add `evergreen-human-needed` and explain the
  needed change instead):
  - `.github/**` (including `CODEOWNERS` and Evergreen's own workflow files)
  - `.circleci/**`
  - `netlify.toml` (redirects and headers)
  - `package.json`, `package-lock.json`, and any plugin `package.json`
  - `patches/**`
  - `AGENTS.md`, `AGENTS_REFERENCE.md`, `.claude/**`, `.cursor/**`, `.husky/**`
- High-risk file policy: `safe-outputs.push-to-pull-request-branch.protected-files:
  blocked` hard-blocks any push touching top-level dot-directories, any
  `package.json` or `package-lock.json`, `CODEOWNERS`, `AGENTS.md`,
  `README.md`, and `CONTRIBUTING.md`. `netlify.toml`, `patches/**`, and
  `AGENTS_REFERENCE.md` are enforced by this policy.
- Gate-clearing policy:
  - Prioritize structural blockers before warning churn that cannot make the
    gate pass.
  - A broken link or anchor that fails `npm run build` is fixed by correcting
    the link. If the fix needs a new `netlify.toml` redirect, report
    `evergreen-human-needed`.
- Deterministic commands (run from the repo root; `CYPRESS_INSTALL_BINARY=0`
  and `HUSKY=0` are set for the whole workflow):
  - Install: `npm ci`
  - Format (required before every commit): `npm run lint:fix`
  - Lint check: `npm run lint`
  - Build: `npm run build` (the authoritative content check; `onBrokenLinks`
    and `onBrokenMarkdownLinks` throw)
  - Typecheck: `npm run typecheck`
  - Unit tests: `npm run test:search` and `npm run test:plugins`
  - Do not run `npm test` (Cypress e2e); it needs the Cypress binary, a running
    server, and a record key. Diagnose e2e failures from CircleCI and Cypress
    Cloud evidence only.
- CI/lint diagnosis policy: read the failing CircleCI job's output through the
  commit status target URL or GitHub check details, identify the exact failing
  command, reproduce it locally with the matching command above, and rerun it
  after the fix. Never call an e2e failure flaky without spec, error, and
  screenshot evidence.
- Generated file policy: do not hand-edit `src/data/plugins-generated.json` or
  `dist/`. Do not commit build output.
- Signed commit policy: signed commits are not required.

## Review Policy

- Reviewer request policy: never request or re-request reviewers.
- Review thread policy: comment only; never resolve review threads.
- Human-needed cases: `license/cla` failures (a contributor must sign),
  protected-file changes, missing approvals, Netlify deploy failures caused by
  site configuration, and merge conflicts.
- Comment style: terse; only for meaningful work, blockers, human-needed
  decisions, or quota exhaustion. Do not repeat comments for unchanged state.

## Skills

- Runtime Evergreen skill pins: `evergreen-diagnose` and `evergreen-repair` from
  `githubnext/evergreen@5ef522ae2ec229bd42cf32987b7a8c5ebba192fe`.
- Existing repo skills to reuse: none exist. Load `AGENTS.md` and
  `AGENTS_REFERENCE.md` as authoring guidance.
- Additional repo skills: none.
- Skills not to use: none.

## Quotas

- Per-PR AIC/token/cost budget: measured as agent runs (below); inference is
  billed to the organization's Copilot AI Credits.
- Max runs: 6 agent runs per continuous application of `evergreen`. Preflight
  runs that do not dispatch the agent do not count.
- Max repeated attempts per failure signature: 2.
- Wall-clock limit: 60 minutes per run.
- Exhaustion behavior: remove `evergreen`, add `evergreen-exhausted`, and leave
  one terse comment. A human can reapply `evergreen` for a fresh quota.

## Discovered Repo Context

- Agent guidance: `AGENTS.md` (commands, verify ladder, authoring rules),
  `AGENTS_REFERENCE.md`, `CONTRIBUTING.md`, and
  `.github/pull_request_template.md`.
- Existing workflow conventions: GitHub Actions is used only for automation
  (`update-plugins-data.yml`, `tag-docs-release.yml`); CI is CircleCI
  (`.circleci/config.yml`) and Netlify. Jobs that push or use secrets are
  guarded to `main` on `cypress-io/cypress-documentation`. Node version comes
  from `.node-version`.
- Last 50 closed PR process scan (#6835 to #6894): all 50 merged by squash; 0
  drafts; 0 used auto-merge; 2 from forks (#6851, #6861); 12 were nightly
  `chore: update plugins data` PRs authored by `github-actions`, which passed
  `license/cla`; labels are rarely used (`Cypress 16` on 4 PRs). Several
  maintainer PRs merged with `REVIEW_REQUIRED` because admins can bypass
  (`enforce_admins: false`).
- Uncertainties:
  - Whether `license/cla` passes for commits pushed by Evergreen's identity.
    The `github-actions` plugins-data PRs suggest bot commits are allowed.
  - Whether the Docusaurus build needs network hosts beyond the npm registry.
    If the build fails only inside Evergreen, report it and add hosts to
    `network.allowed`.
  - CircleCI's truncated context name `ci/circleci: Algolia, plugins)` changes
    if that job is renamed; update `REQUIRED_CHECKS_JSON` in `evergreen.md`
    with it.
