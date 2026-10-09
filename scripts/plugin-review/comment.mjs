// @ts-check
/**
 * Render the review as the pull request comment.
 *
 * Built to scan: each plugin gets a heading with its verdict, one table of what
 * needs attention, and the requirements it meets folded into a <details> block.
 * Status is a plain word, not an emoji, so it reads the same in email
 * notifications and screen readers.
 */

import { STATUS, code } from './checks.mjs'

export const MARKER = '<!-- plugin-review -->'

const REQUIREMENTS_URL =
  'https://github.com/cypress-io/cypress-documentation/blob/main/CONTRIBUTING.md#adding-plugins'

const LABEL = {
  [STATUS.notMet]: '**Not met**',
  [STATUS.unclear]: 'Unclear',
  [STATUS.notChecked]: 'Not checked',
}

/** @type {string[]} */
const ORDER = [STATUS.notMet, STATUS.unclear, STATUS.notChecked]

/**
 * Make text from a plugin entry or the model safe for a table cell: one line,
 * no raw HTML, no pipes that split the cell, and no @mentions that would ping
 * someone. Inline code spans stay intact.
 */
export function cell(text, max = 240) {
  let s = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (s.length > max) s = s.slice(0, max - 1).trimEnd() + '…'
  // Odd segments are inside `code spans`, where GitHub shows entities
  // literally, so this escapes HTML only outside them. It escapes pipes in
  // both: GitHub splits table cells on them even inside a code span.
  return s
    .split(/(`[^`]*`)/)
    .map((part, i) =>
      i % 2
        ? part
        : part
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/@(?=\w)/g, '@​')
    )
    .join('')
    .replace(/\|/g, '\\|')
}

/**
 * @param {Array<{ plugin: Record<string, any>, category: string, rows: Array<{ label: string, status: string, detail: string }>, docsSource?: string }>} results
 * @param {{ footer?: string }} [options]
 */
export function renderComment(results, options = {}) {
  const out = [MARKER, '## Plugin review', '']

  if (!results.length) {
    out.push(
      `No new plugins found in ${code('src/data/plugins.json')}. Edits to existing entries aren’t reviewed.`
    )
  } else {
    const count =
      results.length === 1 ? '1 new plugin' : `${results.length} new plugins`
    out.push(
      `Checked ${count} against the [plugin requirements](${REQUIREMENTS_URL}). Advisory only: a maintainer makes the final call.`
    )
    for (const result of results) out.push('', ...renderPlugin(result))
  }

  if (options.footer) out.push('', '---', options.footer)
  return out.join('\n') + '\n'
}

/** @param {{ plugin: Record<string, any>, category: string, rows: Array<{ label: string, status: string, detail: string }>, docsSource?: string }} result */
function renderPlugin({ plugin, category, rows, docsSource }) {
  // The name sits inside a code span, where HTML and @mentions are inert, so
  // it only needs to stay on one line and keep its backticks out.
  const name = String(plugin.name || 'Unnamed plugin')
    .replace(/[`\s]+/g, ' ')
    .trim()
    .slice(0, 80)
  const open = rows
    .filter((r) => r.status !== STATUS.met)
    .sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status))
  const met = rows.filter((r) => r.status === STATUS.met)

  const out = [`### \`${name}\`: ${verdict(rows)}`, '']

  const meta = [`Category: ${cell(category, 60)}`]
  if (typeof plugin.link === 'string' && /^https:\/\//.test(plugin.link)) {
    meta.push(
      `[Source](${plugin.link.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\s/g, '%20')})`
    )
  }
  if (docsSource) meta.push(`Docs reviewed from the ${cell(docsSource, 80)}`)
  out.push(meta.join(' · '), '')

  if (open.length) {
    out.push('| Requirement | Result | Details |', '| --- | --- | --- |')
    for (const r of open) {
      out.push(`| ${r.label} | ${LABEL[r.status]} | ${cell(r.detail)} |`)
    }
    out.push('')
  }

  if (met.length) {
    const summary = `${met.length} ${met.length === 1 ? 'requirement' : 'requirements'} met`
    out.push(
      `<details><summary>${summary}</summary>`,
      '',
      '| Requirement | Details |',
      '| --- | --- |',
      ...met.map((r) => `| ${r.label} | ${cell(r.detail) || '—'} |`),
      '',
      '</details>'
    )
  }

  return out
}

/** One-line verdict for the plugin heading, worst news first. */
export function verdict(rows) {
  const count = (status) => rows.filter((r) => r.status === status).length
  const notMet = count(STATUS.notMet)
  const unclear = count(STATUS.unclear)
  const notChecked = count(STATUS.notChecked)

  if (!notMet && !unclear && !notChecked) return 'meets every requirement'
  const parts = []
  if (notMet) parts.push(`${notMet} not met`)
  if (unclear) parts.push(`${unclear} unclear`)
  if (notChecked) parts.push(`${notChecked} not checked`)
  return parts.join(', ')
}
