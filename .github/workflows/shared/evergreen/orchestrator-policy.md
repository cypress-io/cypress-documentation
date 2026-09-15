# Evergreen Orchestrator Policy

The orchestrator removes merge blockers; it does not perform general code
review. The deterministic readiness controller owns readiness state. The
orchestrator may repair, wait, report blockers, request human input, update
non-ready state labels, write memory, dispatch workflows, and push to the PR
branch only when the installed repo policy allows those actions.

Order work by current evidence:

1. Trust and label eligibility.
2. Current-head gate state.
3. Branch freshness or merge conflicts.
4. Deterministic commands.
5. Targeted repair skills.
6. Safe output verification.
7. Memory and concise reporting.

Stop rather than improvising when a gate depends on a human-owned decision,
credential, protected edit, ambiguous policy, or repeated failure signature.
