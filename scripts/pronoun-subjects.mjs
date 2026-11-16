#!/usr/bin/env node
// Lists sentences in docs prose that open with a bare pronoun ("It runs…",
// "This means…", "They are…"), for the "Name the subject in every sentence"
// rule in AGENTS.md.
//
//   npm run lint:pronouns -- docs/app/ai/cypress-tap.mdx [more files]
//
// The rule needs a reader: a pronoun can point at a noun in the same sentence,
// and "It is recommended…" points at nothing. So this prints candidates for
// review and always exits 0.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PRONOUN = /^(It|It's|Its|They|They're|They've|Their|This|That|That's|These|Those)\b/

// "It" with no referent: "It is recommended to…", "It's a good idea to…".
const DUMMY_IT = new RegExp(
  "^It(?:'s|’s| is| was| wasn't| wasn’t| would be| may be| can be| could be| should be| will be)" +
    '(?: (?:not|also|usually|often|always|generally|still|now|no longer|very|entirely|much|so|quite|sometimes))*' +
    ' (?:(?:a|an|the|our) )?(?:great |good |common )?' +
    '(?:idea|goal|practice|recommended|important|possible|impossible|necessary|best|better|worth|likely|unlikely|' +
    'safe|unsafe|common|easier|harder|faster|slower|helpful|useful|nice|valuable|required|advisable|essential|' +
    'crucial|critical|difficult|hard|tempting|true|clear|obvious|acceptable|okay|fine|up to)\\b' +
    '|^It depends\\b'
)

const IDIOM = /^(?:That's it|That is it|That said|That is,|That way\b)/

// After "This"/"That"/"These"/"Those", these words show the pronoun stands
// alone ("This is…", "This also means…") rather than leading a noun.
const STANDS_ALONE = new Set(
  `is are was were will would can could should may might must do does did has have had
  isn't aren't wasn't weren't won't wouldn't can't cannot couldn't shouldn't doesn't don't didn't hasn't haven't
  also only now already usually often typically generally always never still then just
  automatically previously sometimes mostly largely essentially`.split(/\s+/)
)

// A word that commonly follows a third-person verb: "This makes the…",
// "This lets you…", "This happens when…". A noun ending in -s rarely has one
// of these right after it, so "This process runs" isn't flagged.
const AFTER_VERB = new Set(
  `the a an your you it its their them us our we cypress to in on for with from that this these those
  all each every any some sure up out down back when if because after before as by into across over
  through without more less`.split(/\s+/)
)

function standsAlone(rest) {
  const [next = '', after = ''] = rest.split(/\s+/)
  if (!next || /^[.,:;!?)]/.test(next)) return true
  const word = next.toLowerCase().replace(/[^a-z']/g, '')
  if (STANDS_ALONE.has(word)) return true
  const afterWord = after.toLowerCase().replace(/[^a-z]/g, '')
  return /[^su]s$/.test(word) && !/(ss|us|is)$/.test(word) && AFTER_VERB.has(afterWord)
}

// The sentence up to its end, following it onto wrapped lines.
function wrapped(start, lines, i) {
  let text = start
  for (let j = i + 1; j < lines.length && !/[.!?]["'”’)]*(\s|$)/.test(text); j++) {
    if (!lines[j].trim() || BLOCK_START.test(lines[j]) || SKIP.test(lines[j])) break
    text += ` ${flatten(lines[j].trim())}`
  }
  return text.split(/(?<=[.!?]["'”’)]*)\s/)[0]
}

const shorten = (s) => (s.length > 100 ? `${s.slice(0, 97)}…` : s)

// Inline code and link URLs can hold any text, so flatten them before looking
// for sentence boundaries.
function flatten(text) {
  return text
    .replace(/`[^`]*`/g, 'CODE')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*|__|(?<!\w)[*_](?!\s)|(?<!\s)[*_](?!\w)/g, '')
}

const BLOCK_START = /^\s*(?:[-*+]\s+|\d+[.)]\s+|>\s*|\|)/
const SKIP = /^\s*(?:#|:::|import\s|export\s|<|\{|\}|<!--|\||---\s*$)/

export function findPronounSubjects(source) {
  const lines = source.split('\n')
  const found = []
  let inFence = null
  let inFrontmatter = lines[0]?.trim() === '---'
  let prevEnded = true

  lines.forEach((raw, i) => {
    if (inFrontmatter) {
      if (i > 0 && raw.trim() === '---') inFrontmatter = false
      return
    }
    const fence = raw.match(/^\s*(`{3,}|~{3,})/)
    if (inFence) {
      if (fence && fence[1][0] === inFence[0] && fence[1].length >= inFence.length) inFence = null
      prevEnded = true
      return
    }
    if (fence) {
      inFence = fence[1]
      return
    }
    if (!raw.trim()) {
      prevEnded = true
      return
    }

    const isTable = /^\s*\|/.test(raw)
    if (SKIP.test(raw) && !isTable) {
      prevEnded = true
      return
    }

    const cells = isTable ? raw.split('|').slice(1, -1) : [raw]
    for (const cell of cells) {
      const blockStart = isTable || BLOCK_START.test(cell) || prevEnded
      const text = flatten(cell.replace(BLOCK_START, ''))
      const starts = []
      if (blockStart) starts.push(text.search(/\S/))
      for (const m of text.matchAll(/[.!?]["'”’)]*\s+(?=\S)/g)) starts.push(m.index + m[0].length)
      for (const at of starts) {
        if (at < 0) continue
        const start = text.slice(at).replace(/^["'“(]+/, '')
        const sentence = isTable ? start : wrapped(start, lines, i)
        const m = sentence.match(PRONOUN)
        if (!m || DUMMY_IT.test(sentence) || IDIOM.test(sentence)) continue
        const word = m[1]
        if (/^(This|That|These|Those)$/.test(word) && !standsAlone(sentence.slice(word.length).trim())) continue
        found.push({ line: i + 1, word, sentence: shorten(sentence.trim()) })
      }
    }
    prevEnded = isTable || /[.!?:]["'”’)]*\s*$/.test(raw)
  })
  return found
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = process.argv.slice(2)
  if (!files.length) {
    console.error('Usage: npm run lint:pronouns -- <file.mdx> [more files]')
    process.exit(1)
  }
  let total = 0
  for (const file of files) {
    for (const hit of findPronounSubjects(readFileSync(file, 'utf8'))) {
      console.log(`${file}:${hit.line}: ${hit.sentence}`)
      total++
    }
  }
  console.log(
    total
      ? `\n${total} sentence(s) open with a pronoun. Each one that points back to an earlier sentence should name its subject instead (AGENTS_REFERENCE.md#person-and-tense). Leave a "this" or "that" that leads its noun, and an "it" with no referent.`
      : 'No sentences open with a bare pronoun.'
  )
}
