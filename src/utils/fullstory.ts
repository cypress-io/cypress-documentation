export type MarkdownDestination = 'ChatGPT' | 'Claude'

// Every Fullstory event this site sends, with its properties. docs.cypress.io,
// www.cypress.io, and Cypress Cloud record into one Fullstory org, so these
// follow www.cypress.io's rules: names are Title Case "Object Action" in the
// past tense, and properties are camelCase ids, counts, booleans, and fixed
// labels, never free text or PII. Fullstory keys funnels on the exact name, so
// renaming an event breaks every funnel built on it.
export interface FullStoryEvents {
  'AI Prompt Copied': {
    promptTitle: string
    pagePath: string
    /** False when the card was collapsed at the moment of the copy. */
    promptWasVisible: boolean
  }
  'AI Prompt Expanded': { promptTitle: string; pagePath: string }
  'Page Markdown Copied': { pagePath: string }
  'Page Markdown Menu Opened': { pagePath: string }
  'Page Markdown Opened': {
    pagePath: string
    destination: MarkdownDestination
  }
  'Page Markdown Viewed': { pagePath: string }
  'Code Block Copied': {
    /** The block's language tag, such as `ts`, or an empty string. */
    language: string
    /** The block's title (usually a filename), or an empty string. */
    codeTitle: string
    pagePath: string
  }
  'Tab Selected': {
    /** The tab set's groupId, or an empty string for a set without one. */
    groupId: string
    value: string
  }
  'Support Assistant Opened': { entryPoint: 'Docs Button' }
  'Support Assistant Load Failed': Record<string, never>
}

declare global {
  interface Window {
    FS?: (method: string, options?: unknown) => unknown
  }
}

/**
 * Send a Fullstory custom event. Does nothing when Fullstory isn't loaded (no
 * org ID, no Analytics consent, an ad blocker), and never throws, so tracking
 * can't break the interaction that triggered it.
 */
export function trackFullStoryEvent<Name extends keyof FullStoryEvents>(
  name: Name,
  properties: FullStoryEvents[Name]
): void {
  if (typeof window === 'undefined' || typeof window.FS !== 'function') {
    return
  }
  try {
    window.FS('trackEvent', { name, properties })
  } catch {}
}

/** The path of the current page, never its query string or hash. */
export const currentPagePath = (): string =>
  typeof window === 'undefined' ? '' : window.location.pathname
