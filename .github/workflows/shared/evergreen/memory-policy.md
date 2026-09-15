# Evergreen Memory Policy

Memory is for future-useful facts, not run logs.

Store:

- merge gates and branch protection expectations
- label meanings
- CI failure signatures
- known flaky checks and rerun policy
- reusable accepted fixes
- review patterns that affect mergeability
- skill outcomes
- velocity metrics
- per-PR blockers and attempts to avoid

Each attempt record should include the PR number, raw head SHA, semantic head
key when available, failure signatures, selected runtime skills, deterministic
commands, patches or safe outputs attempted, safe-output verification status,
repeated attempts to avoid, and the next action.

Do not store secrets, raw logs, large diffs, or stale speculation. Write small,
structured, source-aware entries. Ignore trigger-only empty commits when
updating semantic attempt counters.
