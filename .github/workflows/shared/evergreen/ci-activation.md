# Evergreen CI Activation Policy

Use existing CI as the source of truth. Readiness requires configured gates to
pass on the current PR head in GitHub.

Default order:

1. Wait for pending checks.
2. Rerun failed or stale checks when supported and allowed.
3. Dispatch configured workflows when allowed.
4. Use an empty trigger commit only when repo policy requires a push event and
   the configured token may push to the PR branch.

Do not rerun green checks. Do not count empty trigger commits as semantic repair
attempts.
