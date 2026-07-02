<!--
Fill in every section. This template doubles as the historical record of the
change, so future readers (and agents) can understand not just what changed but
why. Delete a section only if it is genuinely not applicable, and say so.
-->

## Summary

<!-- What does this PR change, in one or two sentences? Write for a reader who
has never seen the task. -->

## Why

<!-- The motivation and context. If this originated from an issue, a Slack/
Discord thread, a broken link, an outdated example, or a release, capture it
here so the reasoning survives after the source is gone. -->

Closes #<!-- issue number, or remove this line if none -->

## Verification

<!-- Check what you ran. See the "Verify ladder" in AGENTS.md. Paste relevant
output or note failures rather than deleting a box you skipped. -->

- [ ] `npm run lint:fix` (required before every commit)
- [ ] `npm run build` (required for content changes; enforces links/anchors)
- [ ] `npm run test:plugins` (only if `plugins/` changed)
- [ ] `npm test` (nav/routing or broad changes; needs `npm run start` running)
- [ ] Reviewed the Netlify deploy preview for the affected pages

## Page moves and redirects

<!-- Required if any page was moved, renamed, or deleted. -->

- [ ] Not applicable, no pages were moved/renamed/deleted
- [ ] Added a `301` in `netlify.toml` for each moved/renamed/deleted page
- [ ] Updated in-repo links that pointed at the old path

## Author

<!-- Who or what produced this change, for historical context. -->

- [ ] AI agent (name/model: <!-- e.g. Claude Code -->), reviewed by a human
- [ ] Human

## Notes for reviewers

<!-- Anything a human reviewer should focus on: decisions made, alternatives
considered, areas of uncertainty, or follow-ups intentionally left out. -->
