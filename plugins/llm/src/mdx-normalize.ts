import {
  computeJsxPascalTagDepthDelta,
  stripMdxJsxFromInlineText,
} from './utils'

/** CommonMark-style fenced code block opener (0-3 spaces, then 3+ backticks or tildes). */
function matchFenceStart(line: string): { marker: '`' | '~'; len: number } | null {
  const m = /^ {0,3}(`{3,}|~{3,})/.exec(line)
  if (!m) return null
  const fence = m[1]
  return { marker: fence[0] as '`' | '~', len: fence.length }
}

/** Closing fence: same marker, length ≥ opening; optional 0-3 spaces indent; only trailing whitespace after. */
function isClosingFence(line: string, marker: '`' | '~', openLen: number): boolean {
  const m = /^ {0,3}(`+|~+)(?:\s*)$/.exec(line)
  if (!m) return false
  const run = m[1]
  if (run[0] !== marker) return false
  return run.length >= openLen
}

/**
 * Strips MDX-only syntax and optionally replaces imported partial components with their normalized markdown bodies.
 */
export function normalizeContent(raw: string, inlinePartialsByComponentName: Record<string, string> | null): string {
  const lines = raw.split('\n')
  const out: string[] = []
  let componentDepth = 0
  let inIncompleteJsxOpening = false
  let inFence = false
  let fenceMarker: '`' | '~' = '`'
  let fenceOpenLen = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (inFence) {
      if (isClosingFence(line, fenceMarker, fenceOpenLen)) {
        inFence = false
      }
      out.push(line)
      continue
    }

    const fenceStart = matchFenceStart(line)
    if (fenceStart) {
      inFence = true
      fenceMarker = fenceStart.marker
      fenceOpenLen = fenceStart.len
      out.push(line)
      continue
    }

    if (/^export\s/.test(trimmed)) continue
    if (/^import\s/.test(trimmed)) continue
    if (/^:{3,}/.test(trimmed)) continue

    if (inIncompleteJsxOpening) {
      if (line.includes('>')) {
        inIncompleteJsxOpening = false
        if (!/\/>/.test(line)) {
          componentDepth += 1
        }
      }
      continue
    }

    if (componentDepth > 0) {
      componentDepth += computeJsxPascalTagDepthDelta(line)
      if (componentDepth < 0) componentDepth = 0
      continue
    }

    const atxHeading = /^(\s*)(#{1,6})\s+(.*)$/.exec(line)
    if (atxHeading) {
      const rawText = atxHeading[3]
      const cleaned = stripMdxJsxFromInlineText(rawText) || rawText
      out.push(`${atxHeading[1]}${atxHeading[2]} ${cleaned}`)
      continue
    }

    if (/^<[A-Z]/.test(trimmed)) {
      const selfClosingMatch = /^<([A-Z][A-Za-z0-9]*)\b[^>]*\/>(.*)$/.exec(trimmed)
      const openCloseMatch = /^<([A-Z][A-Za-z0-9]*)\s*>\s*<\/\1>/.exec(trimmed)
      const componentName =
        (selfClosingMatch && selfClosingMatch[1]) || (openCloseMatch && openCloseMatch[1]) || null

      if (componentName && inlinePartialsByComponentName?.[componentName]) {
        out.push(inlinePartialsByComponentName[componentName].trimEnd())
        if (selfClosingMatch) {
          const trailing = selfClosingMatch[2]?.trim()
          if (trailing) {
            out.push(trailing)
          }
        }
        continue
      }
      if (selfClosingMatch) {
        const trailing = selfClosingMatch[2].trim()
        if (trailing) out.push(trailing)
        continue
      }
      componentDepth += computeJsxPascalTagDepthDelta(trimmed)
      if (componentDepth < 0) componentDepth = 0
      if (componentDepth === 0 && !trimmed.includes('>')) {
        inIncompleteJsxOpening = true
      }
      continue
    }

    out.push(line)
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
