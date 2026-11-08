import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, test } from 'vitest'

// src/components/tabs writes each tab's groupId and value onto it, which is
// what the Fullstory "Tab Selected" listener reads. A tab set built straight
// from @theme/Tabs renders without them and never sends the event.
const ROOT = join(__dirname, '../../..')
const SEARCHED = ['docs', 'src', 'plugins']
const SKIPPED = new Set(['node_modules', 'dist', 'build', '.docusaurus'])
const SOURCE = /\.(mdx?|[jt]sx?|mjs|cjs)$/
const WRAPPER = 'src/components/tabs/index.tsx'
const THEME_TABS_IMPORT = /from\s+['"]@theme(-original)?\/Tabs['"]/

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIPPED.has(entry.name)) return []
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return SOURCE.test(entry.name) ? [path] : []
  })
}

describe('Tabs imports', () => {
  test('only the tracking wrapper imports @theme/Tabs', () => {
    const importers = SEARCHED.flatMap((dir) => sourceFiles(join(ROOT, dir)))
      .filter((file) => THEME_TABS_IMPORT.test(readFileSync(file, 'utf8')))
      .map((file) => relative(ROOT, file))

    expect(importers).toEqual([WRAPPER])
  })
})
