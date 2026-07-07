#!/usr/bin/env node
/**
 * Serve the built site and run the page-title Cypress spec against it.
 *
 * The section title suffix is applied during SSR/hydration, so the test must
 * run against the *built* site (`npm run build`), not the dev server. This
 * script serves `dist/` on a dedicated port, waits for it, runs the spec, and
 * always cleans up the server.
 *
 *   npm run test:titles                       # build + serve + run all pages
 *   LIMIT=2 npm run test:titles               # spot-check 2 pages per section
 *   TITLES_PORT=4200 npm run test:titles      # use a different port
 *
 * Run `npm run build` first (the `test:titles` npm script does this for you).
 */
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const waitOn = require('wait-on')

const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const PORT = process.env.TITLES_PORT || '4178'
const BASE_URL = `http://localhost:${PORT}`
const isWin = process.platform === 'win32'

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/ not found — run `npm run build` first (or use `npm run test:titles`).')
  process.exit(1)
}

let server

function shutdown() {
  if (server && !server.killed) server.kill('SIGTERM')
}
process.on('exit', shutdown)
process.on('SIGINT', () => {
  shutdown()
  process.exit(1)
})

async function main() {
  console.log(`Serving dist/ on ${BASE_URL} …`)
  server = spawn(
    'npx',
    ['docusaurus', 'serve', '--dir', 'dist', '--port', String(PORT), '--no-open'],
    { cwd: ROOT, stdio: 'ignore', shell: isWin }
  )
  server.on('exit', (code) => {
    if (code && code !== 0 && code !== null) {
      console.error(`Server exited unexpectedly (code ${code}). Is port ${PORT} free?`)
    }
  })

  await waitOn({ resources: [`http-get://localhost:${PORT}`], timeout: 60000 })
  console.log('Server up. Running page-title spec …')

  const cypressArgs = [
    'cypress',
    'run',
    '--spec',
    'cypress/e2e/page_titles.cy.ts',
    '--config',
    `baseUrl=${BASE_URL}`,
  ]
  if (process.env.LIMIT) cypressArgs.push('--env', `limitPerSection=${process.env.LIMIT}`)

  const exitCode = await new Promise((resolve) => {
    const run = spawn('npx', cypressArgs, { cwd: ROOT, stdio: 'inherit', shell: isWin })
    run.on('exit', (code) => resolve(code ?? 1))
  })

  shutdown()
  process.exit(exitCode)
}

main().catch((err) => {
  console.error(err)
  shutdown()
  process.exit(1)
})
