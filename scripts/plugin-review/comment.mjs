// @ts-check
/**
 * Render the review as the pull request comment: per plugin, a heading with
 * its verdict and one table, worst results first. Status is a plain word, not
 * an emoji, so it reads the same in email notifications and screen readers.
 */

import { STATUS, code } from './checks.mjs'

export const MARKER = '<!-- plugin-review -->'

const REQUIREMENTS_URL =
  'https://github.com/cypress-io/cypress-documentation/blob/main/CONTRIBUTING.md#adding-plugins'

/** Result labels in table order, worst first. */
const LABEL = {
  [STATUS.notMet]: '**Not met**',
  [STATUS.unclear]: 'Unclear',
  [STATUS.notChecked]: 'Not checked',
  [STATUS.met]: 'Met',
}
const ORDER = Object.keys(LABEL)

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
            .replace(/@(?=\w)/g, '@\u200b')
    )
    .join('')
    .replace(/\|/g, '\\|')
}

/**
 * @param {Array<{ plugin: Record<string, any>, rows: Array<{ label: string, status: string, detail: string }> }>} results
 * @param {string} [footer]
 */
export function renderComment(results, footer = '') {
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
  }

  for (const { plugin, rows } of results) {
    // The name sits inside a code span, where HTML and @mentions are inert, so
    // it only needs to stay on one line and keep its backticks out.
    const name = String(plugin.name || 'Unnamed plugin')
      .replace(/[`\s]+/g, ' ')
      .trim()
      .slice(0, 80)
    const sorted = [...rows].sort(
      (a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status)
    )
    out.push(
      '',
      `### \`${name}\`: ${verdict(rows)}`,
      '',
      '| Requirement | Result | Details |',
      '| --- | --- | --- |',
      ...sorted.map(
        (r) => `| ${r.label} | ${LABEL[r.status]} | ${cell(r.detail)} |`
      )
    )
  }

  if (footer) out.push('', '---', footer)
  return out.join('\n') + '\n'
}

/** One-line verdict for the plugin heading, worst news first. */
export function verdict(rows) {
  const parts = ORDER.slice(0, 3)
    .map((status) => [rows.filter((r) => r.status === status).length, status])
    .filter(([n]) => n)
    .map(
      ([n, status]) => `${n} ${LABEL[status].replace(/\*/g, '').toLowerCase()}`
    )
  return parts.length ? parts.join(', ') : 'meets every requirement'
}
