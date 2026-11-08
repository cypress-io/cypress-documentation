import siteConfig from '@generated/docusaurus.config'
import { currentPagePath, trackFullStoryEvent } from '@site/src/utils/fullstory'

// Document-level listeners for the Docusaurus-rendered controls we don't own:
// the code block copy button, the tab list, and the announcement bar. Each
// listener only reads the DOM, so the click it observes runs as it would
// without it.

// Docusaurus's copy button takes its copyButtonCopied class once the clipboard
// write has resolved, and not when the write rejects, so gaining that class is
// the copy's success signal. The class stays for a second, and a click inside
// that second can't be told apart from the first copy, so it sends nothing.
// The one exception is a non-HTTPS origin: there Docusaurus falls back to a
// copy that reports failure without rejecting, and shows the class anyway.
const COPY_SUCCESS_TIMEOUT_MS = 5000

const isShowingCopied = (button: HTMLButtonElement) =>
  Array.from(button.classList).some((name) =>
    name.startsWith('copyButtonCopied')
  )

function watchForCopySuccess(button: HTMLButtonElement) {
  const block = button.closest('.theme-code-block')
  if (!block || isShowingCopied(button)) return

  const observer = new MutationObserver(() => {
    if (!isShowingCopied(button)) return
    stop()
    const languageClass = Array.from(block.classList).find((name) =>
      name.startsWith('language-')
    )
    trackFullStoryEvent('Code Block Copied', {
      language: languageClass ? languageClass.slice('language-'.length) : '',
      codeTitle:
        block.querySelector('[class*="codeBlockTitle"]')?.textContent?.trim() ??
        '',
      pagePath: currentPagePath(),
    })
  })
  const timer = window.setTimeout(() => stop(), COPY_SUCCESS_TIMEOUT_MS)
  function stop() {
    observer.disconnect()
    window.clearTimeout(timer)
  }
  observer.observe(button, {
    attributes: true,
    attributeFilter: ['class'],
  })
}

// The capture phase runs before React's own handlers, so aria-selected still
// describes the tab set before this pick. Tab sets that switch to match
// through groupId, and tabs restored from a saved choice, get no click and
// send nothing.
function trackTabPick(tab: HTMLElement) {
  if (tab.getAttribute('aria-selected') === 'true') return
  trackFullStoryEvent('Tab Selected', {
    groupId: tab.dataset.tabGroupId ?? '',
    value: tab.dataset.tabValue ?? '',
  })
}

function onClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) return

  const tab = event.target.closest<HTMLElement>('[role="tab"][data-tab-value]')
  if (tab) {
    trackTabPick(tab)
    return
  }

  const copyButton = event.target.closest<HTMLButtonElement>(
    '.theme-code-block button[title="Copy"]'
  )
  if (copyButton) watchForCopySuccess(copyButton)
}

// Docusaurus selects a tab on Enter as well as on click.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || !(event.target instanceof Element)) return
  const tab = event.target.closest<HTMLElement>('[role="tab"][data-tab-value]')
  if (tab) trackTabPick(tab)
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKeydown, true)
}

const announcementId: string =
  (siteConfig.themeConfig as { announcementBar?: { id?: string } })
    .announcementBar?.id ?? ''
const ANNOUNCEMENT_SCHEMA = JSON.stringify({ 'data-announcement-id': 'str' })

// A data-fs-element on an ancestor doesn't reliably name a click on a nested
// element, so the label goes on every descendant too (the close icon's <svg>
// and <path>).
function label(element: Element, name: string) {
  for (const node of [element, ...Array.from(element.querySelectorAll('*'))]) {
    node.setAttribute('data-fs-element', name)
    node.setAttribute('data-announcement-id', announcementId)
    node.setAttribute('data-fs-properties-schema', ANNOUNCEMENT_SCHEMA)
  }
}

// The announcement bar's content is raw HTML from docusaurus.config.js and
// its close button belongs to Docusaurus, so both are labeled once they
// render, on every page. A link that already carries a conversion label keeps
// it.
export function onRouteDidUpdate() {
  const bar = document.querySelector('.theme-announcement-bar')
  if (!bar) return
  bar.querySelectorAll('a:not([data-fs-element])').forEach((link) => {
    label(link, 'Docs Announcement - Link')
  })
  const close = bar.querySelector('button.close')
  if (close) label(close, 'Docs Announcement - Close')
}
