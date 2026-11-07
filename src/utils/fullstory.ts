/**
 * Custom events sent to Fullstory. The names are what Fullstory groups the
 * event history by, so renaming one starts a new history and orphans the old
 * one.
 */
export const FULLSTORY_EVENTS = {
  copiedAiPrompt: 'Copied AI Prompt',
  expandedAiPrompt: 'Expanded AI Prompt',
  copiedPageMarkdown: 'Copied Page Markdown',
  viewedPageMarkdown: 'Viewed Page Markdown',
  openedPageMarkdownInChatGpt: 'Opened Page Markdown in ChatGPT',
  openedPageMarkdownInClaude: 'Opened Page Markdown in Claude',
  openedPageMarkdownMenu: 'Opened Page Markdown Menu',
} as const

export type FullstoryEventName =
  (typeof FULLSTORY_EVENTS)[keyof typeof FULLSTORY_EVENTS]

type FullstoryProperties = Record<string, string | number | boolean>

/**
 * Send a custom event through Fullstory's v2 API.
 *
 * `window.FS` exists only in production builds with an org ID, and only once
 * the reader has consented, so a missing `FS` is the normal case. Analytics
 * must never break the control that reports to it, so this swallows errors.
 */
export function trackEvent(
  name: FullstoryEventName,
  properties: FullstoryProperties
): void {
  if (typeof window === 'undefined') return
  const fs = (window as { FS?: unknown }).FS
  if (typeof fs !== 'function') return
  try {
    fs('trackEvent', { name, properties })
  } catch {
    // Reporting failed; the reader's action already succeeded.
  }
}
