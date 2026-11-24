import { afterEach, describe, expect, test } from 'vitest'
import fullStory from './fullstory.js'

const { consentGate } = fullStory

const ACCEPT = { ANALYTICS: 'ACCEPT', MARKETING: 'ACCEPT' }
const DENY = { ANALYTICS: 'DENY', MARKETING: 'ACCEPT' }

function fakeFs() {
  const calls = []
  const fs = (method, args) => {
    calls.push(args === undefined ? [method] : [method, args])
  }
  fs._v = '2.1.0'
  return { fs, calls }
}

function fakeOsano(initialConsent) {
  let consent = initialConsent
  const listeners = []
  const cm = {
    getConsent: () => consent,
    addEventListener: (name, listener) => {
      if (name === 'osano-cm-consent-saved') listeners.push(listener)
    },
  }
  const save = (next) => {
    consent = next
    listeners.forEach((listener) => listener(next))
  }
  return { Osano: { cm }, save }
}

function runGate(window) {
  new Function('window', consentGate)(window)
}

describe('consentGate', () => {
  test('delays capture on startup', () => {
    const { fs, calls } = fakeFs()
    runGate({ FS: fs, Osano: fakeOsano(DENY).Osano })
    expect(calls[0]).toEqual(['init', { env: { captureOnStartup: false } }])
  })

  test('starts capture when Analytics is already accepted', () => {
    const { fs, calls } = fakeFs()
    runGate({ FS: fs, Osano: fakeOsano(ACCEPT).Osano })
    expect(calls.slice(1)).toEqual([['start']])
  })

  test('waits while Analytics is denied, then starts once accepted', () => {
    const { fs, calls } = fakeFs()
    const osano = fakeOsano(DENY)
    runGate({ FS: fs, Osano: osano.Osano })
    expect(calls.slice(1)).toEqual([])

    osano.save(ACCEPT)
    expect(calls.slice(1)).toEqual([['start']])
  })

  test('shuts down when consent is withdrawn and restarts when it returns', () => {
    const { fs, calls } = fakeFs()
    const osano = fakeOsano(ACCEPT)
    runGate({ FS: fs, Osano: osano.Osano })

    osano.save(DENY)
    osano.save(DENY)
    osano.save(ACCEPT)
    osano.save(ACCEPT)
    expect(calls.slice(1)).toEqual([['start'], ['shutdown'], ['restart']])
  })

  test('never starts capture without Osano', () => {
    const { fs, calls } = fakeFs()
    runGate({ FS: fs })
    expect(calls).toEqual([['init', { env: { captureOnStartup: false } }]])
  })

  test('leaves another script’s FS global alone', () => {
    const calls = []
    const otherFs = (...args) => calls.push(args)
    runGate({ FS: otherFs, Osano: fakeOsano(ACCEPT).Osano })
    expect(calls).toEqual([])
  })
})

describe('fullStory plugin', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  async function headTags(env) {
    process.env = { ...originalEnv, ...env }
    if (env.FULLSTORY_ORG_ID === undefined) delete process.env.FULLSTORY_ORG_ID
    const plugin = await fullStory({})
    return plugin.injectHtmlTags({}).headTags
  }

  test('adds nothing without an org ID', async () => {
    expect(await headTags({ NODE_ENV: 'production' })).toBeUndefined()
    expect(
      await headTags({ NODE_ENV: 'production', FULLSTORY_ORG_ID: '' })
    ).toBeUndefined()
  })

  test('adds nothing outside production', async () => {
    expect(
      await headTags({ NODE_ENV: 'development', FULLSTORY_ORG_ID: 'test-org' })
    ).toBeUndefined()
  })

  test('adds the snippet, then the consent gate', async () => {
    const tags = await headTags({
      NODE_ENV: 'production',
      FULLSTORY_ORG_ID: 'test-org',
    })
    expect(tags).toHaveLength(2)
    expect(tags[0].innerHTML).toContain('"FS","test-org")')
    expect(tags[1].innerHTML).toBe(consentGate)
  })
})
