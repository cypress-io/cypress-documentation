# Evergreen Safe Output Policy

Allowed safe outputs in v1:

- PR comments for meaningful work, blockers, human-needed decisions, quota
  exhaustion, or verified state changes.
- Non-ready state labels.
- PR branch pushes for PRs that still have the opt-in label and satisfy trust
  policy.
- Workflow dispatch or rerun according to repo policy.
- Pull request reviews or review comments only when configured.

Disallowed safe outputs in v1:

- Direct PR merge.
- Base-branch writes.
- Branch update commits that merge or rebase the base branch into the PR branch;
  branch freshness is controller-owned.
- Adding or removing the ready label from the agentic workflow.
- Secret disclosure in comments, logs, commits, generated policy, or memory.

Every safe output must be verified before the orchestrator describes it as
successful.

After a safe output request, reload GitHub state and confirm the relevant
result:

- Comments exist with the expected content and identifier.
- Labels were added or removed as expected.
- A workflow dispatch or rerun was accepted.
- Reviews or review comments exist.
- A PR branch push changed the head SHA to the expected commit.
- The expected files changed on the PR branch.

If verification fails, report the operation as blocked. Do not use completion
language for an unverified side effect.
