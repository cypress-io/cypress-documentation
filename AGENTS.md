# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
Cypress documentation site built with Docusaurus 3. See `README.md` for standard commands (`npm run start`, `npm run build`, `npm run lint`).

### Node version
Requires Node.js 22.x (see `.node-version` for exact version). The environment uses nvm to manage versions.

### Remark plugins sub-package
The `plugins/cypressRemarkPlugins/` sub-package must be built before the dev server or production build can run. The `prestart` and `prebuild` npm scripts handle this automatically.

**Important**: Do NOT install dependencies inside `plugins/cypressRemarkPlugins/` separately. The sub-package intentionally relies on the root `node_modules` for both the TypeScript compiler and type definitions. Installing a local `node_modules` there causes TypeScript version conflicts and build failures.

### Dev server
- `npm run start` starts the Docusaurus dev server on `http://localhost:3000`
- For headless environments, use `npm run start -- --host 0.0.0.0 --no-open`

### Lint
- `npm run lint` runs Prettier checks on markdown/MDX files. This is the only lint check run in CI.
- `npm run typecheck` (`tsc`) has pre-existing type errors due to Docusaurus virtual `@theme/*` module imports. CI does not run typecheck.

### Testing
- `npm run test` runs Cypress E2E tests. Requires the dev server to already be running on port 3000.
- CI runs tests in parallel with `npx wait-on http://localhost:3000 && npx cypress run --parallel --record`.

### No secrets required for local development
All necessary keys for client-side features (Algolia search) are embedded in `docusaurus.config.js`. No `.env` file or secret configuration is needed for local development.
