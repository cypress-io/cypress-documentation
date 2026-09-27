#!/bin/bash
# Installs dependencies, including the Cypress binary, in Claude Code on the web
# sessions, so the code example harness (AGENTS_REFERENCE.md#verifying-code-examples)
# can run. Install output goes to stderr; stdout becomes session context, so it
# gets one status line.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# The harness needs the binary, which CYPRESS_INSTALL_BINARY=0 would skip.
unset CYPRESS_INSTALL_BINARY

# `npm install` rather than `npm ci`: it reuses node_modules from the cached
# container, so a warm session skips the install.
npm install --no-audit --no-fund >&2

if ! npx cypress verify >&2; then
  npx cypress install >&2
  npx cypress verify >&2
fi

echo "Dependencies installed and Cypress $(npx cypress version --component binary) verified. Code examples can run in the .example-check/ harness."
