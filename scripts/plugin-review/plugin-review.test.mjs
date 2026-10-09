import { describe, expect, it } from 'vitest'
import {
  STATUS,
  checkDocs,
  checkEntry,
  checkNpm,
  checkRepo,
} from './checks.mjs'
import { MARKER, cell, renderComment, verdict } from './comment.mjs'
import { findNewPlugins, flattenPlugins, normalizeLink } from './diff.mjs'

const plugin = (overrides = {}) => ({
  name: 'cypress-example',
  description: 'Does a thing.',
  link: 'https://github.com/someone/cypress-example',
  keywords: ['example'],
  ...overrides,
})

const list = (...categories) => ({
  plugins: categories.map(([name, plugins]) => ({ name, plugins })),
})

const byLabel = (rows, label) => rows.find((r) => r.label === label)

describe('findNewPlugins', () => {
  const base = list([
    'Utilities',
    [plugin({ name: 'old', link: 'https://github.com/a/old' })],
  ])

  it('returns entries whose link and name are both new', () => {
    const head = list([
      'Utilities',
      [plugin({ name: 'old', link: 'https://github.com/a/old' }), plugin()],
    ])
    expect(findNewPlugins(base, head).map((e) => e.plugin.name)).toEqual([
      'cypress-example',
    ])
  })

  it('ignores an entry moved to another category or reformatted', () => {
    const head = list([
      'Other',
      [plugin({ name: 'old', link: 'http://www.github.com/a/old.git/' })],
    ])
    expect(findNewPlugins(base, head)).toEqual([])
  })

  it('treats a renamed entry with the same link as existing', () => {
    const head = list([
      'Utilities',
      [plugin({ name: 'renamed', link: 'https://github.com/a/old' })],
    ])
    expect(findNewPlugins(base, head)).toEqual([])
  })

  it('reports the category of each new entry', () => {
    const head = list(['Utilities', []], ['Visual Testing', [plugin()]])
    expect(findNewPlugins(base, head)[0].category).toBe('Visual Testing')
  })

  it('normalizes links', () => {
    expect(normalizeLink('https://GitHub.com/A/B.git/#readme')).toBe(
      'github.com/a/b'
    )
  })
})

describe('checkEntry', () => {
  it('passes a complete community entry', () => {
    const rows = checkEntry(plugin(), [])
    expect(rows.every((r) => r.status === STATUS.met)).toBe(true)
  })

  it('names every field problem in one row', () => {
    const rows = checkEntry(
      plugin({ description: '', link: 'http://x', badge: 'gold', extra: 1 }),
      []
    )
    const row = byLabel(rows, 'Entry fields')
    expect(row.status).toBe(STATUS.notMet)
    expect(row.detail).toBe(
      'Unknown field `extra`; `description` is empty; `link` must be an https URL or a path on this site; `badge` must be `official` or `community`'
    )
  })

  it('rejects the official badge outside cypress-io', () => {
    const rows = checkEntry(plugin({ badge: 'official' }), [])
    expect(byLabel(rows, 'Badge').status).toBe(STATUS.notMet)
  })

  it('accepts the official badge on a cypress-io repo', () => {
    const rows = checkEntry(
      plugin({ badge: 'official', link: 'https://github.com/cypress-io/x' }),
      []
    )
    expect(byLabel(rows, 'Badge').status).toBe(STATUS.met)
  })

  it('accepts the official badge on a docs site path', () => {
    const rows = checkEntry(
      plugin({
        badge: 'official',
        link: '/ui-coverage/get-started/introduction',
      }),
      []
    )
    expect(byLabel(rows, 'Badge').status).toBe(STATUS.met)
    expect(byLabel(rows, 'Entry fields').status).toBe(STATUS.met)
  })

  it('flags a duplicate npm package listed under another name', () => {
    const existing = flattenPlugins(
      list([
        'U',
        [
          plugin({
            name: 'Example',
            link: 'https://x.dev',
            npm: 'cypress-example',
          }),
        ],
      ])
    )
    const rows = checkEntry(plugin({ npm: 'cypress-example' }), existing)
    expect(byLabel(rows, 'Not already listed').status).toBe(STATUS.notMet)
  })
})

const manifest = (version, extra = {}) => ({
  name: 'cypress-example',
  'dist-tags': { latest: version },
  versions: {
    [version]: {
      homepage: 'https://example.dev',
      repository: {
        type: 'git',
        url: 'git+https://github.com/someone/cypress-example.git',
      },
      bugs: { url: 'https://github.com/someone/cypress-example/issues' },
      peerDependencies: { cypress: '>=13' },
      ...extra,
    },
  },
})

describe('checkNpm', () => {
  it('passes a published package that supports the latest major', () => {
    const rows = checkNpm(
      { pkg: 'cypress-example', manifest: manifest('1.2.0'), notFound: false },
      16
    )
    expect(rows.map((r) => r.status)).toEqual([
      STATUS.met,
      STATUS.met,
      STATUS.met,
    ])
    expect(byLabel(rows, 'Supports Cypress 16').detail).toBe(
      'Peer range `>=13`'
    )
  })

  it('fails a peer range that excludes the latest major', () => {
    const rows = checkNpm(
      {
        pkg: 'x',
        manifest: manifest('1.0.0', {
          peerDependencies: { cypress: '^13 || ^14' },
        }),
        notFound: false,
      },
      16
    )
    const row = byLabel(rows, 'Supports Cypress 16')
    expect(row.status).toBe(STATUS.notMet)
    expect(row.detail).toBe('Peer range `^13 || ^14` excludes Cypress 16')
  })

  it('lists missing package.json fields', () => {
    const rows = checkNpm(
      {
        pkg: 'x',
        manifest: manifest('1.0.0', { homepage: '', bugs: undefined }),
        notFound: false,
      },
      16
    )
    expect(byLabel(rows, 'package.json metadata').detail).toBe(
      'Missing `homepage` and `bugs`'
    )
  })

  it('is unclear without a cypress peer dependency', () => {
    const rows = checkNpm(
      {
        pkg: 'x',
        manifest: manifest('1.0.0', { peerDependencies: {} }),
        notFound: false,
      },
      16
    )
    expect(byLabel(rows, 'Supports Cypress 16').status).toBe(STATUS.unclear)
  })

  it('only flags a dev dependency that misses the latest major', () => {
    const rows = checkNpm(
      {
        pkg: 'x',
        manifest: manifest('1.0.0', {
          peerDependencies: {},
          devDependencies: { cypress: '15.7.0' },
        }),
        notFound: false,
      },
      16
    )
    const row = byLabel(rows, 'Supports Cypress 16')
    expect(row.status).toBe(STATUS.unclear)
    expect(row.detail).toBe(
      'No peer dependency; built against `15.7.0`, not Cypress 16'
    )
  })

  it('ignores monorepo placeholder versions', () => {
    const rows = checkNpm(
      {
        pkg: 'x',
        manifest: manifest('1.0.0', {
          peerDependencies: {},
          devDependencies: { cypress: '0.0.0-development' },
        }),
        notFound: false,
      },
      16
    )
    expect(byLabel(rows, 'Supports Cypress 16').detail).toBe(
      'No `cypress` peer dependency declared'
    )
  })

  it('accepts a wildcard peer range', () => {
    const rows = checkNpm(
      {
        pkg: 'x',
        manifest: manifest('1.0.0', { peerDependencies: { cypress: '*' } }),
        notFound: false,
      },
      16
    )
    expect(byLabel(rows, 'Supports Cypress 16').status).toBe(STATUS.met)
  })

  it('fails a deprecated release', () => {
    const rows = checkNpm(
      {
        pkg: 'x',
        manifest: manifest('1.0.0', { deprecated: 'use y' }),
        notFound: false,
      },
      16
    )
    expect(byLabel(rows, 'Published to npm').status).toBe(STATUS.notMet)
  })

  it('fails a named package that 404s and skips the rest', () => {
    const rows = checkNpm(
      { pkg: 'missing-pkg', manifest: null, notFound: true },
      16
    )
    expect(rows.map((r) => r.status)).toEqual([
      STATUS.notMet,
      STATUS.notChecked,
      STATUS.notChecked,
    ])
  })

  it('reports a registry outage as not checked', () => {
    const rows = checkNpm(
      { pkg: null, manifest: null, notFound: false, failed: true },
      16
    )
    expect(rows[0].status).toBe(STATUS.notChecked)
  })
})

const repo = (overrides = {}) => ({
  host: 'github',
  info: { archived: false, default_branch: 'main' },
  path: '',
  tree: {
    paths: [
      'package.json',
      'cypress.config.ts',
      'cypress/e2e/a.cy.ts',
      'cypress/e2e/b.cy.ts',
      '.github/workflows/ci.yml',
    ],
    truncated: false,
  },
  workflows: {
    '.github/workflows/ci.yml': 'uses: cypress-io/github-action@v7',
    '.github/workflows/nightly.yml': 'run: npm run enrich',
  },
  runs: [
    { path: '.github/workflows/nightly.yml', conclusion: 'failure' },
    { path: '.github/workflows/ci.yml', conclusion: 'success' },
  ],
  branch: 'main',
  ...overrides,
})

describe('checkRepo', () => {
  it('passes a repo with tests and green CI that runs Cypress', () => {
    const rows = checkRepo(repo())
    expect(rows.map((r) => r.status)).toEqual([
      STATUS.met,
      STATUS.met,
      STATUS.met,
    ])
    expect(byLabel(rows, 'Cypress tests').detail).toBe(
      'Found `cypress.config.ts` and 2 spec files'
    )
    expect(byLabel(rows, 'CI pipeline').detail).toBe(
      'GitHub Actions; `ci.yml` runs Cypress; latest `ci.yml` run on `main` passed'
    )
  })

  it('fails a repo with no tests and no CI', () => {
    const rows = checkRepo(
      repo({
        tree: { paths: ['index.js', 'README.md'], truncated: false },
        workflows: {},
        runs: [],
      })
    )
    expect(byLabel(rows, 'Cypress tests').status).toBe(STATUS.notMet)
    expect(byLabel(rows, 'CI pipeline').status).toBe(STATUS.notMet)
  })

  it('looks for tests only under a monorepo subpath', () => {
    const rows = checkRepo(repo({ path: 'npm/plugin' }))
    expect(byLabel(rows, 'Cypress tests').status).toBe(STATUS.notMet)
  })

  it('is unclear when the latest Cypress workflow run failed', () => {
    const rows = checkRepo(
      repo({
        runs: [{ path: '.github/workflows/ci.yml', conclusion: 'failure' }],
      })
    )
    expect(byLabel(rows, 'CI pipeline').status).toBe(STATUS.unclear)
  })

  it('is unclear when no workflow runs Cypress', () => {
    const rows = checkRepo(
      repo({
        workflows: {
          '.github/workflows/ci.yml':
            'repository: cypress-io/cypress-documentation\nrun: npm test',
        },
      })
    )
    expect(byLabel(rows, 'CI pipeline').detail).toContain(
      'no workflow runs Cypress directly'
    )
  })

  it('recognizes the common ways a workflow runs Cypress', () => {
    for (const step of [
      'run: npx cypress run --browser chrome',
      'run: npm run cy:run',
      'run: yarn cypress:run',
    ]) {
      const rows = checkRepo(
        repo({ workflows: { '.github/workflows/ci.yml': step }, runs: [] })
      )
      expect(byLabel(rows, 'CI pipeline').status).toBe(STATUS.met)
    }
  })

  it('fails an archived repo', () => {
    const rows = checkRepo(repo({ info: { archived: true } }))
    expect(byLabel(rows, 'Source repository').status).toBe(STATUS.notMet)
  })

  it('fails a repo GitHub reports as missing', () => {
    const rows = checkRepo({ host: 'github', info: null, infoStatus: 404 })
    expect(rows.map((r) => r.status)).toEqual([
      STATUS.notMet,
      STATUS.notChecked,
      STATUS.notChecked,
    ])
  })

  it('skips repos outside GitHub', () => {
    expect(
      checkRepo({ host: 'other' }).every((r) => r.status === STATUS.notChecked)
    ).toBe(true)
  })
})

describe('checkDocs', () => {
  it('reports every criterion as not checked when skipped', () => {
    const rows = checkDocs({ skipped: 'No key' })
    expect(rows).toHaveLength(4)
    expect(
      rows.every((r) => r.status === STATUS.notChecked && r.detail === 'No key')
    ).toBe(true)
  })

  it('maps the model result onto rows', () => {
    const criteria = {
      purpose: { status: 'met', detail: 'Opening line says what it does' },
      installation: { status: 'not_met', detail: 'No install command' },
      api: { status: 'unclear', detail: 'Options listed without defaults' },
      usability: { status: 'bogus', detail: 'x' },
    }
    expect(checkDocs({ criteria }).map((r) => r.status)).toEqual([
      STATUS.met,
      STATUS.notMet,
      STATUS.unclear,
      STATUS.unclear,
    ])
  })
})

describe('renderComment', () => {
  const rows = [
    { label: 'Entry fields', status: STATUS.met, detail: 'ok' },
    { label: 'Cypress tests', status: STATUS.notMet, detail: 'none' },
    {
      label: 'Installation guide',
      status: STATUS.notChecked,
      detail: 'No key',
    },
    { label: 'CI pipeline', status: STATUS.unclear, detail: 'red' },
  ]

  it('starts with the marker the workflow uses to find its comment', () => {
    expect(renderComment([]).startsWith(`${MARKER}\n`)).toBe(true)
  })

  it('says so when nothing is new', () => {
    expect(renderComment([])).toContain('No new plugins found')
  })

  it('puts the verdict in the heading and sorts open rows worst first', () => {
    const md = renderComment([
      { plugin: plugin(), category: 'Utilities', rows },
    ])
    expect(md).toContain(
      '### `cypress-example`: 1 not met, 1 unclear, 1 not checked'
    )
    const order = ['Cypress tests', 'CI pipeline', 'Installation guide'].map(
      (l) => md.indexOf(`| ${l} |`)
    )
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(md).toContain('<details><summary>1 requirement met</summary>')
  })

  it('uses no emoji', () => {
    const md = renderComment([
      { plugin: plugin(), category: 'Utilities', rows },
    ])
    expect(md).not.toMatch(/\p{Extended_Pictographic}/u)
  })

  it('says when everything is met', () => {
    expect(verdict([{ status: STATUS.met }])).toBe('meets every requirement')
  })
})

describe('cell', () => {
  it('keeps text on one line and escapes table pipes', () => {
    expect(cell('a\nb | c')).toBe('a b \\| c')
  })

  it('escapes HTML outside code spans only', () => {
    expect(cell('<img> and `>=12 <17`')).toBe('&lt;img&gt; and `>=12 <17`')
  })

  it('defuses @mentions', () => {
    expect(cell('ping @octocat')).toBe('ping @​octocat')
  })

  it('truncates long text', () => {
    expect(cell('x'.repeat(300))).toHaveLength(240)
  })
})
