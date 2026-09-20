/**
 * Check if the 'dist' directories for the built plugin sub-packages exist,
 * and builds them if not. Used in the 'prestart' npm script to
 * verify plugins are there before 'npm run start' is called.
 *
 * Both are listed because 'npm run build:plugins' builds both, and
 * docusaurus.config.js requires both at startup. Paths are case-sensitive on
 * Linux and in CI, so they must match the directory names exactly.
 */

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const pluginDirs = [
  './plugins/cypressRemarkPlugins/dist',
  './plugins/llm/dist',
]

const missing = pluginDirs.some(
  (dir) => !fs.existsSync(path.join(process.cwd(), dir))
)

if (missing) {
  exec('npm run build:plugins', (err, stdout) => {
    if (err) {
      console.error('Error building plugins:', err)
    } else {
      console.log('Done building plugins')
    }
  })
}
