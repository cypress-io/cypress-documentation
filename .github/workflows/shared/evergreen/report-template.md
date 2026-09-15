# Evergreen Report Template

Use short reports. Prefer no comment when state has not changed.

Required fields when commenting:

- Current blocker or action.
- Evidence source.
- What changed, if anything.
- What happens next.

Before reporting, evaluate current-head CI/check gates, merge conflicts, branch
freshness, draft state, configured review and CODEOWNERS requirements,
unresolved review threads, required or blocker labels, and configured docs,
release, deployment, or security gates.

End with exactly one state: `return-to-controller`, `blocked`, `needs-human`,
`waiting`, or `continue`. Never request or mutate the ready label.

Avoid broad narration. Do not say a fix landed, a check is green, or a PR is
ready unless the relevant GitHub state proves it.
