import { describe, expect, it } from 'vitest'
import {
  STATUS,
  checkClaude,
  checkEntry,
  checkNpm,
  checkSource,
} from './checks.mjs'
import { MARKER, cell, renderComment } from './comment.mjs'
import { findNewPlugins } from './diff.mjs'

const plugin = (overrides = {}) => ({
  name: 'cypress-example',
  description: 'Does a thing.',
  link: 'https://github.com/someone/cypress-example',
  ...overrides,
})
const list = (...plugins) => ({ plugins: [{ name: 'Utilities', plugins }] })
const byLabel = (rows, label) => rows.find((r) => r.label === label)

describe('findNewPlugins', () => {
  const base = list(plugin({ name: 'old', link: 'https://github.com/a/old' }))

  it('returns only entries whose link and name are both new', () => {
    const head = list(
      plugin({ name: 'old', link: 'https://github.com/a/old' }),
      plugin()
    )
    expect(findNewPlugins(base, head).map((p) => p.name)).toEqual([
      'cypress-example',
    ])
  })

  it('ignores a moved, reformatted, or renamed entry', () => {
    expect(
      findNewPlugins(
        base,
        list(plugin({ name: 'old', link: 'http://www.github.com/a/old.git/' }))
      )
    ).toEqual([])
    expect(
      findNewPlugins(
        base,
        list(plugin({ name: 'renamed', link: 'https://github.com/a/old' }))
      )
    ).toEqual([])
  })
})

describe('checkEntry', () => {
  it('passes a valid community entry', () => {
    expect(checkEntry(plugin(), []).every((r) => r.status === STATUS.met)).toBe(
      true
    )
  })

  it('reports schema errors', () => {
    const row = byLabel(
      checkEntry(plugin({ badge: 'gold' }), []),
      'Entry fields'
    )
    expect(row.status).toBe(STATUS.notMet)
    expect(row.detail).toBe(
      'badge must be equal to one of the allowed values: official, community'
    )
  })

  it('allows the official badge only on Cypress-owned links', () => {
    const badge = (link) =>
      byLabel(checkEntry(plugin({ badge: 'official', link }), []), 'Badge')
        .status
    expect(badge('https://github.com/someone/x')).toBe(STATUS.notMet)
    expect(badge('https://github.com/cypress-io/x')).toBe(STATUS.met)
    expect(badge('/ui-coverage/get-started/introduction')).toBe(STATUS.met)
  })

  it('flags an npm package already listed under another name', () => {
    const existing = [
      plugin({
        name: 'Example',
        link: 'https://x.dev',
        npm: 'cypress-example',
      }),
    ]
    expect(
      byLabel(
        checkEntry(plugin({ npm: 'cypress-example' }), existing),
        'Not already listed'
      ).status
    ).toBe(STATUS.notMet)
  })
})

const npm = (extra = {}) => ({
  pkg: 'cypress-example',
  notFound: false,
  manifest: {
    name: 'cypress-example',
    'dist-tags': { latest: '1.0.0' },
    versions: {
      '1.0.0': {
        homepage: 'https://example.dev',
        repository: {
          url: 'git+https://github.com/someone/cypress-example.git',
        },
        bugs: { url: 'https://github.com/someone/cypress-example/issues' },
        peerDependencies: { cypress: '>=13' },
        ...extra,
      },
    },
  },
})
const compat = (extra) =>
  byLabel(checkNpm(npm(extra), 16), 'Supports Cypress 16')

describe('checkNpm', () => {
  it('passes a published package that supports the latest major', () => {
    expect(checkNpm(npm(), 16).every((r) => r.status === STATUS.met)).toBe(true)
  })

  it('fails a peer range that excludes the latest major', () => {
    expect(
      compat({ peerDependencies: { cypress: '^13 || ^14' } })
    ).toMatchObject({
      status: STATUS.notMet,
      detail: 'Peer range `^13 || ^14` excludes Cypress 16',
    })
  })

  it('only flags a dev dependency, and ignores monorepo placeholders', () => {
    expect(
      compat({ peerDependencies: {}, devDependencies: { cypress: '15.7.0' } })
        .status
    ).toBe(STATUS.unclear)
    expect(
      compat({
        peerDependencies: {},
        devDependencies: { cypress: '0.0.0-development' },
      }).detail
    ).toBe('No `cypress` peer dependency declared')
  })

  it('lists missing package.json fields and fails deprecated releases', () => {
    const rows = checkNpm(
      npm({ homepage: '', bugs: undefined, deprecated: 'use y' }),
      16
    )
    expect(byLabel(rows, 'package.json metadata').detail).toBe(
      'Missing `homepage`, `bugs`'
    )
    expect(byLabel(rows, 'Published to npm').status).toBe(STATUS.notMet)
  })

  it('fails a named package that 404s', () => {
    const rows = checkNpm(
      { pkg: 'missing', manifest: null, notFound: true },
      16
    )
    expect(rows.map((r) => r.status)).toEqual([
      STATUS.notMet,
      STATUS.notChecked,
      STATUS.notChecked,
    ])
  })
})

describe('checkSource', () => {
  it('reports an archived, missing, or non-GitHub repo', () => {
    expect(
      checkSource({ host: 'github', info: { archived: false } }).status
    ).toBe(STATUS.met)
    expect(
      checkSource({ host: 'github', info: { archived: true } }).status
    ).toBe(STATUS.notMet)
    expect(
      checkSource({ host: 'github', info: null, infoStatus: 404 }).status
    ).toBe(STATUS.notMet)
    expect(checkSource({ host: 'other' }).status).toBe(STATUS.notChecked)
  })
})

describe('checkClaude', () => {
  it('reports every criterion as not checked when skipped', () => {
    const rows = checkClaude({ skipped: 'No key' })
    expect(rows).toHaveLength(6)
    expect(
      rows.every((r) => r.status === STATUS.notChecked && r.detail === 'No key')
    ).toBe(true)
  })

  it('maps results onto rows and treats an unknown status as unclear', () => {
    const rows = checkClaude({
      criteria: {
        tests: { status: 'met', detail: 'cypress.config.ts' },
        ci: { status: 'bogus', detail: 'x' },
      },
    })
    expect(byLabel(rows, 'Cypress tests').status).toBe(STATUS.met)
    expect(byLabel(rows, 'CI pipeline').status).toBe(STATUS.unclear)
    expect(byLabel(rows, 'Installation guide').status).toBe(STATUS.notChecked)
  })
})

describe('renderComment', () => {
  const rows = [
    { label: 'Entry fields', status: STATUS.met, detail: 'ok' },
    { label: 'Cypress tests', status: STATUS.notMet, detail: 'none' },
    { label: 'CI pipeline', status: STATUS.unclear, detail: 'red' },
  ]

  it('starts with the marker and says when nothing is new', () => {
    expect(renderComment([])).toMatch(
      new RegExp(`^${MARKER}\\n[\\s\\S]*No new plugins found`)
    )
  })

  it('puts the verdict in the heading and sorts rows worst first, with no emoji', () => {
    const md = renderComment([{ plugin: plugin(), rows }])
    expect(md).toContain('### `cypress-example`: 1 not met, 1 unclear')
    expect(md.indexOf('| Cypress tests')).toBeLessThan(
      md.indexOf('| CI pipeline')
    )
    expect(md.indexOf('| CI pipeline')).toBeLessThan(
      md.indexOf('| Entry fields')
    )
    expect(md).not.toMatch(/\p{Extended_Pictographic}/u)
  })
})

describe('cell', () => {
  it('keeps text on one line, escapes HTML outside code spans, and defuses mentions', () => {
    expect(cell('a\nb | <img> `>=12 <17` @octocat')).toBe(
      'a b \\| &lt;img&gt; `>=12 <17` @​octocat'
    )
    expect(cell('x'.repeat(300))).toHaveLength(240)
  })
})
