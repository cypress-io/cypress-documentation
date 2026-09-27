import { afterEach, test, expect, describe } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { writeSkillsIndex } from '../src/skills'

type Skill = {
  name: string
  type: string
  description: string
  url: string
}

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-test-'))
  tempDirs.push(dir)
  return dir
}

function writeAndReadIndex() {
  const dist = makeTempDir()
  writeSkillsIndex(dist)
  return JSON.parse(
    fs.readFileSync(
      path.join(dist, '.well-known', 'agent-skills', 'index.json'),
      'utf8'
    )
  )
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

// ---------------------------------------------------------------------------
// Output file
// ---------------------------------------------------------------------------

describe('writeSkillsIndex: output file', () => {
  test('creates .well-known/agent-skills/index.json at the distRoot', () => {
    const dist = makeTempDir()
    writeSkillsIndex(dist)
    expect(
      fs.existsSync(path.join(dist, '.well-known', 'agent-skills', 'index.json'))
    ).toBe(true)
  })

  test('declares the discovery 0.2.0 schema', () => {
    expect(writeAndReadIndex().$schema).toBe(
      'https://schemas.agentskills.io/discovery/0.2.0/schema.json'
    )
  })
})

// ---------------------------------------------------------------------------
// Published skills
//
// The index exists to tell agents which skills Cypress publishes, so it has to
// stay in step with https://github.com/cypress-io/ai-toolkit/tree/main/skills
// and with the AI Skills docs page. It is maintained by hand — this is the
// check that catches a skill being shipped but never advertised.
// ---------------------------------------------------------------------------

describe('writeSkillsIndex: published skills', () => {
  test('lists every skill published in cypress-io/ai-toolkit', () => {
    const names = writeAndReadIndex().skills.map((s: Skill) => s.name)
    expect(names.sort()).toEqual([
      'cypress-author',
      'cypress-docs',
      'cypress-explain',
    ])
  })

  test('advertises cypress-docs, the documentation skill', () => {
    const docs = writeAndReadIndex().skills.find(
      (s: Skill) => s.name === 'cypress-docs'
    )
    expect(docs).toBeDefined()
    expect(docs.url).toBe(
      'https://github.com/cypress-io/ai-toolkit/tree/main/skills/cypress-docs'
    )
  })

  test('gives every skill a name, type, description, and url', () => {
    for (const skill of writeAndReadIndex().skills) {
      expect(Object.keys(skill).sort()).toEqual([
        'description',
        'name',
        'type',
        'url',
      ])
      expect(skill.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(skill.type).toBe('skill-md')
      expect(skill.description.trim().length).toBeGreaterThan(0)
      expect(skill.url.startsWith('https://')).toBe(true)
    }
  })

  test('names are unique', () => {
    const names = writeAndReadIndex().skills.map((s: Skill) => s.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
