import { afterEach, test, expect, describe } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {
  toPosixPath,
  ensureDir,
  writeJsonFile,
  walkDocs,
  slugify,
  countWords,
  tokenizeCount,
  parseHeadingLine,
  stripMarkdownExtension,
  replaceMarkdownExtension,
  getGitSha,
  countMarkdownAndJsonFiles,
} from '../src/utils'

const tempDirs: string[] = []

function makeTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'utils-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
  tempDirs.length = 0
})

// ---------------------------------------------------------------------------
// toPosixPath
// ---------------------------------------------------------------------------

describe('toPosixPath', () => {
  test('replaces backslashes with forward slashes', () => {
    expect(toPosixPath('a\\b\\c')).toBe('a/b/c')
  })

  test('leaves forward slashes unchanged', () => {
    expect(toPosixPath('a/b/c')).toBe('a/b/c')
  })

  test('handles empty string', () => {
    expect(toPosixPath('')).toBe('')
  })

  test('replaces all backslashes in a mixed path', () => {
    expect(toPosixPath('C:\\Users\\foo\\bar/baz')).toBe('C:/Users/foo/bar/baz')
  })
})

// ---------------------------------------------------------------------------
// ensureDir
// ---------------------------------------------------------------------------

describe('ensureDir', () => {
  test('creates a new directory', () => {
    const root = makeTempDir()
    const dir = path.join(root, 'new-dir')
    ensureDir(dir)
    expect(fs.existsSync(dir)).toBe(true)
  })

  test('creates nested directories recursively', () => {
    const root = makeTempDir()
    const dir = path.join(root, 'a', 'b', 'c')
    ensureDir(dir)
    expect(fs.existsSync(dir)).toBe(true)
  })

  test('does not throw when directory already exists', () => {
    const root = makeTempDir()
    expect(() => ensureDir(root)).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// writeJsonFile
// ---------------------------------------------------------------------------

describe('writeJsonFile', () => {
  test('writes formatted JSON to disk', () => {
    const root = makeTempDir()
    const file = path.join(root, 'out.json')
    writeJsonFile(file, { hello: 'world', n: 42 })
    const content = fs.readFileSync(file, 'utf8')
    expect(JSON.parse(content)).toEqual({ hello: 'world', n: 42 })
  })

  test('output is indented with 2 spaces', () => {
    const root = makeTempDir()
    const file = path.join(root, 'out.json')
    writeJsonFile(file, { a: 1 })
    const content = fs.readFileSync(file, 'utf8')
    expect(content).toContain('  "a": 1')
  })

  test('overwrites an existing file', () => {
    const root = makeTempDir()
    const file = path.join(root, 'out.json')
    writeJsonFile(file, { v: 1 })
    writeJsonFile(file, { v: 2 })
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual({ v: 2 })
  })
})

// ---------------------------------------------------------------------------
// walkDocs
// ---------------------------------------------------------------------------

describe('walkDocs', () => {
  test('returns .md files', () => {
    const root = makeTempDir()
    fs.writeFileSync(path.join(root, 'doc.md'), '')
    const files = walkDocs(root)
    expect(files.some((f) => f.endsWith('doc.md'))).toBe(true)
  })

  test('returns .mdx files', () => {
    const root = makeTempDir()
    fs.writeFileSync(path.join(root, 'doc.mdx'), '')
    const files = walkDocs(root)
    expect(files.some((f) => f.endsWith('doc.mdx'))).toBe(true)
  })

  test('returns .markdown files', () => {
    const root = makeTempDir()
    fs.writeFileSync(path.join(root, 'doc.markdown'), '')
    const files = walkDocs(root)
    expect(files.some((f) => f.endsWith('doc.markdown'))).toBe(true)
  })

  test('ignores non-markdown files', () => {
    const root = makeTempDir()
    fs.writeFileSync(path.join(root, 'image.png'), '')
    fs.writeFileSync(path.join(root, 'data.json'), '')
    fs.writeFileSync(path.join(root, 'doc.md'), '')
    const files = walkDocs(root)
    expect(files.every((f) => /\.(md|mdx|markdown)$/i.test(f))).toBe(true)
  })

  test('recurses into subdirectories', () => {
    const root = makeTempDir()
    fs.mkdirSync(path.join(root, 'sub'))
    fs.writeFileSync(path.join(root, 'sub', 'nested.mdx'), '')
    const files = walkDocs(root)
    expect(files.some((f) => f.endsWith('nested.mdx'))).toBe(true)
  })

  test('returns empty array for an empty directory', () => {
    const root = makeTempDir()
    expect(walkDocs(root)).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

describe('slugify', () => {
  test('lowercases and trims', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world')
  })

  test('replaces spaces and non-alphanumeric characters with hyphens', () => {
    expect(slugify('Foo & Bar')).toBe('foo-bar')
  })

  test('collapses consecutive non-alphanumeric runs into a single hyphen', () => {
    expect(slugify('one -- two')).toBe('one-two')
  })

  test('strips backticks and single/double quotes', () => {
    expect(slugify("`code` and 'quotes' and \"dquotes\"")).toBe('code-and-quotes-and-dquotes')
  })

  test('trims leading and trailing hyphens', () => {
    expect(slugify('---title---')).toBe('title')
  })

  test('returns "section" for an empty or whitespace-only string', () => {
    expect(slugify('')).toBe('section')
    expect(slugify('   ')).toBe('section')
  })

  test('preserves digits', () => {
    expect(slugify('Step 1: Do it')).toBe('step-1-do-it')
  })
})

// ---------------------------------------------------------------------------
// countWords
// ---------------------------------------------------------------------------

describe('countWords', () => {
  test('counts words split on whitespace', () => {
    expect(countWords('hello world')).toBe(2)
  })

  test('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0)
  })

  test('returns 0 for whitespace-only string', () => {
    expect(countWords('   ')).toBe(0)
  })

  test('handles multiple spaces between words', () => {
    expect(countWords('a  b   c')).toBe(3)
  })

  test('handles leading and trailing whitespace', () => {
    expect(countWords('  one two  ')).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// tokenizeCount
// ---------------------------------------------------------------------------

describe('tokenizeCount', () => {
  test('estimates tokens as word count divided by 0.75, rounded', () => {
    // 3 words → Math.round(3 / 0.75) = Math.round(4) = 4
    expect(tokenizeCount('one two three')).toBe(4)
  })

  test('returns 0 for empty string', () => {
    expect(tokenizeCount('')).toBe(0)
  })

  test('rounds fractional values', () => {
    // 2 words → Math.round(2 / 0.75) = Math.round(2.666…) = 3
    expect(tokenizeCount('hello world')).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// parseHeadingLine
// ---------------------------------------------------------------------------

describe('parseHeadingLine', () => {
  test('parses H1', () => {
    expect(parseHeadingLine('# Title')).toEqual({ level: 1, text: 'Title' })
  })

  test('parses H2', () => {
    expect(parseHeadingLine('## Sub heading')).toEqual({ level: 2, text: 'Sub heading' })
  })

  test('parses H6', () => {
    expect(parseHeadingLine('###### Deep')).toEqual({ level: 6, text: 'Deep' })
  })

  test('returns null for non-heading line', () => {
    expect(parseHeadingLine('Not a heading')).toBeNull()
  })

  test('returns null when # has no space after it', () => {
    expect(parseHeadingLine('#NoSpace')).toBeNull()
  })

  test('trims trailing whitespace from heading text', () => {
    expect(parseHeadingLine('# Title  ')).toEqual({ level: 1, text: 'Title' })
  })
})

// ---------------------------------------------------------------------------
// stripMarkdownExtension
// ---------------------------------------------------------------------------

describe('stripMarkdownExtension', () => {
  test('strips .md', () => {
    expect(stripMarkdownExtension('foo.md')).toBe('foo')
  })

  test('strips .mdx', () => {
    expect(stripMarkdownExtension('foo.mdx')).toBe('foo')
  })

  test('strips .markdown', () => {
    expect(stripMarkdownExtension('foo.markdown')).toBe('foo')
  })

  test('strips case-insensitively', () => {
    expect(stripMarkdownExtension('FOO.MD')).toBe('FOO')
  })

  test('leaves non-markdown extension unchanged', () => {
    expect(stripMarkdownExtension('foo.txt')).toBe('foo.txt')
  })

  test('works with a full path', () => {
    expect(stripMarkdownExtension('docs/guide/intro.mdx')).toBe('docs/guide/intro')
  })
})

// ---------------------------------------------------------------------------
// replaceMarkdownExtension
// ---------------------------------------------------------------------------

describe('replaceMarkdownExtension', () => {
  test('replaces .md with a new extension (with leading dot)', () => {
    expect(replaceMarkdownExtension('foo.md', '.json')).toBe('foo.json')
  })

  test('replaces .mdx with a new extension (without leading dot)', () => {
    expect(replaceMarkdownExtension('foo.mdx', 'json')).toBe('foo.json')
  })

  test('replaces .markdown', () => {
    expect(replaceMarkdownExtension('foo.markdown', '.txt')).toBe('foo.txt')
  })

  test('leaves non-markdown extension unchanged', () => {
    expect(replaceMarkdownExtension('foo.txt', '.md')).toBe('foo.txt')
  })

  test('works with a full path', () => {
    expect(replaceMarkdownExtension('docs/guide/intro.mdx', '.json')).toBe('docs/guide/intro.json')
  })
})

// ---------------------------------------------------------------------------
// getGitSha
// ---------------------------------------------------------------------------

describe('getGitSha', () => {
  test('returns a 40-char hex sha when called inside a git repo', () => {
    // Use the project root which is a real git repo
    const sha = getGitSha(path.resolve(__dirname, '../../..'))
    expect(sha).toMatch(/^[0-9a-f]{40}$/)
  })

  test('returns null for a non-git directory', () => {
    const dir = makeTempDir()
    expect(getGitSha(dir)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// countMarkdownAndJsonFiles
// ---------------------------------------------------------------------------

describe('countMarkdownAndJsonFiles', () => {
  test('returns zeros when directory does not exist', () => {
    expect(countMarkdownAndJsonFiles('/nonexistent')).toEqual({ markdown: 0, json: 0 })
  })

  test('returns zeros for an empty directory', () => {
    const root = makeTempDir()
    expect(countMarkdownAndJsonFiles(root)).toEqual({ markdown: 0, json: 0 })
  })

  test('counts .md files', () => {
    const root = makeTempDir()
    fs.writeFileSync(path.join(root, 'a.md'), '')
    fs.writeFileSync(path.join(root, 'b.md'), '')
    expect(countMarkdownAndJsonFiles(root).markdown).toBe(2)
  })

  test('counts .json files', () => {
    const root = makeTempDir()
    fs.writeFileSync(path.join(root, 'a.json'), '')
    fs.writeFileSync(path.join(root, 'b.json'), '')
    expect(countMarkdownAndJsonFiles(root).json).toBe(2)
  })

  test('ignores other file types', () => {
    const root = makeTempDir()
    fs.writeFileSync(path.join(root, 'image.png'), '')
    fs.writeFileSync(path.join(root, 'data.mdx'), '')
    expect(countMarkdownAndJsonFiles(root)).toEqual({ markdown: 0, json: 0 })
  })

  test('recurses into subdirectories', () => {
    const root = makeTempDir()
    fs.mkdirSync(path.join(root, 'sub'))
    fs.writeFileSync(path.join(root, 'top.md'), '')
    fs.writeFileSync(path.join(root, 'sub', 'nested.md'), '')
    fs.writeFileSync(path.join(root, 'sub', 'data.json'), '')
    expect(countMarkdownAndJsonFiles(root)).toEqual({ markdown: 2, json: 1 })
  })
})
