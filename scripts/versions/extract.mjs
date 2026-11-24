#!/usr/bin/env node
// Builds the older docs versions in doc-versions.json from their git tags.
// Each version also gets its tag's src/ in .versions/<name>/, so its pages
// render with the components they were written against.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const siteDir = path.resolve(import.meta.dirname, '../..')
const require = createRequire(import.meta.url)

const OUTPUTS = [
  'versioned_docs',
  'versioned_sidebars',
  'versions.json',
  '.versions',
]
const TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.md',
  '.mdx',
  '.css',
  '.scss',
])

// Old components run against today's Docusaurus, not the one at their tag.
// Each entry fixes one import that has since moved.
const COMPAT_REWRITES = [
  [
    /import\s*\{\s*useDoc\s*\}\s*from\s*['"]@docusaurus\/theme-common\/internal['"]/g,
    "import { useDoc } from '@docusaurus/plugin-content-docs/client'",
  ],
]

function git(args, options = {}) {
  return execFileSync('git', args, { cwd: siteDir, ...options })
}

function clean() {
  for (const out of OUTPUTS) {
    fs.rmSync(path.join(siteDir, out), { recursive: true, force: true })
  }
}

// CI and deploy checkouts are shallow and have no tags.
function ensureTag(tag) {
  try {
    git(['rev-parse', '-q', '--verify', `refs/tags/${tag}^{commit}`], {
      stdio: 'ignore',
    })
  } catch {
    console.log(`Fetching tag ${tag}`)
    git(
      [
        'fetch',
        '--no-tags',
        '--depth=1',
        'origin',
        `refs/tags/${tag}:refs/tags/${tag}`,
      ],
      { stdio: 'inherit' }
    )
  }
}

function walk(dir, visit) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, visit)
    else visit(full)
  }
}

// Without this, @site/ imports in a version resolve to today's files.
function rewriteAliases(dir, name) {
  walk(dir, (file) => {
    if (!TEXT_EXTENSIONS.has(path.extname(file))) return
    const before = fs.readFileSync(file, 'utf8')
    let after = before
      .replaceAll('@site/src/', `@site/.versions/${name}/src/`)
      .replaceAll('@site/docs/', `@site/versioned_docs/version-${name}/`)
    // The build now appends this suffix itself.
    if (file.endsWith('.mdx')) {
      after = after.replace(
        /(?<![\s\S])(---\n[^]*?^title:\s*['"]?.*?)\s*\|\s*Cypress Documentation(['"]?)\s*$/m,
        '$1$2'
      )
    }
    for (const [pattern, replacement] of COMPAT_REWRITES) {
      after = after.replace(pattern, replacement)
    }
    if (after !== before) fs.writeFileSync(file, after)
  })
}

function readComponentMap(file) {
  const source = fs.readFileSync(file, 'utf8')
  const imports = new Map()
  for (const m of source.matchAll(
    /^import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/gm
  )) {
    imports.set(m[1], m[2])
  }
  const body = source.match(/export\s+default\s+\{([\s\S]*?)\n\}/)
  if (!body) throw new Error(`No export default object in ${file}`)
  const entries = []
  for (const raw of body[1].split('\n')) {
    const line = raw
      .replace(/\/\/.*$/, '')
      .trim()
      .replace(/,$/, '')
    if (!line || line.startsWith('...')) continue
    const [key, value = key] = line.split(':').map((s) => s.trim())
    if (!/^[A-Z][\w$]*$/.test(key)) continue
    const importPath = imports.get(value)
    if (!importPath) {
      console.warn(`  ${key}: no default import for ${value}, skipped`)
      continue
    }
    entries.push([key, importPath])
  }
  return entries
}

function extractVersion({ name, tag }) {
  console.log(`Version ${name} from ${tag}`)
  ensureTag(tag)

  const workDir = path.join(siteDir, '.versions', name)
  fs.mkdirSync(workDir, { recursive: true })
  const tar = git(
    ['archive', '--format=tar', tag, 'docs', 'src', 'sidebars.js'],
    {
      maxBuffer: 1024 * 1024 * 1024,
    }
  )
  execFileSync('tar', ['-x', '-C', workDir], { input: tar })

  const docsDir = path.join(siteDir, 'versioned_docs', `version-${name}`)
  fs.mkdirSync(path.dirname(docsDir), { recursive: true })
  fs.renameSync(path.join(workDir, 'docs'), docsDir)

  rewriteAliases(docsDir, name)
  rewriteAliases(path.join(workDir, 'src'), name)

  const entries = readComponentMap(
    path.join(workDir, 'src/theme/MDXComponents.js')
  )
  fs.writeFileSync(
    path.join(workDir, 'components.js'),
    entries
      .map(([key, p]) => `export { default as ${key} } from '${p}'\n`)
      .join('')
  )
  fs.writeFileSync(
    path.join(workDir, 'components.json'),
    JSON.stringify(entries.map(([key]) => key))
  )

  const sidebars = require(path.join(workDir, 'sidebars.js'))
  const sidebarsDir = path.join(siteDir, 'versioned_sidebars')
  fs.mkdirSync(sidebarsDir, { recursive: true })
  fs.writeFileSync(
    path.join(sidebarsDir, `version-${name}-sidebars.json`),
    JSON.stringify(sidebars, null, 2)
  )
  console.log(`  ${entries.length} components and partials mapped`)
}

const versions = JSON.parse(
  fs.readFileSync(path.join(siteDir, 'doc-versions.json'), 'utf8')
)

clean()
if (!process.argv.includes('--clean')) {
  for (const version of versions) extractVersion(version)
  fs.writeFileSync(
    path.join(siteDir, 'versions.json'),
    JSON.stringify(
      versions.map((v) => v.name),
      null,
      2
    ) + '\n'
  )
}
