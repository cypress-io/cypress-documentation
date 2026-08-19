import React, { useEffect, useRef, useState } from 'react'
import { useColorMode } from '@docusaurus/theme-common'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Button from '@cypress-design/react-button'
import Icon from '@cypress-design/react-icon'
import Select, { type SelectItem } from '@cypress-design/react-select'
import { markdownPathFor } from '@site/src/utils/markdown-url'
import { copyPendingText } from '@site/src/utils/copy-to-clipboard'
import s from './style.module.css'

/** How long the button keeps showing the result of the last copy. */
const RESET_DELAY = 3000

type CopyState = 'idle' | 'copied' | 'error'

const LABELS: Record<CopyState, string> = {
  idle: 'Copy page',
  copied: 'Copied',
  error: 'Copy failed',
}

/**
 * Reader-facing entry point to the page's markdown, rendered beside the page
 * title by `src/theme/DocItem/Content`.
 *
 * The markdown itself is already published at the page's route plus `.md` and
 * announced in the page head as `<link rel="alternate" type="text/markdown">`,
 * but nothing in the head is visible: this surfaces it. The button copies the
 * markdown; the dropdown beside it opens the raw file or hands the URL to an
 * AI assistant.
 *
 * The whole control carries `data-sanitize` so it is stripped from the LLM
 * markdown export — it is page chrome, and an agent reading the export already
 * has the content these buttons fetch.
 */
export default function MarkdownActions(): React.JSX.Element {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  // The copy is a network round trip, so the reader can navigate to another
  // page before it lands; don't touch state (or leave a timer) after that.
  const mounted = useRef(true)
  const { colorMode } = useColorMode()
  const { pathname } = useLocation()
  const { siteConfig } = useDocusaurusContext()

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(resetTimeout.current)
    }
  }, [])

  // Relative for the browser's own requests, absolute for the prompt: the
  // assistant fetches the URL from somewhere else entirely.
  const markdownPath = markdownPathFor(pathname)
  const markdownUrl = `${siteConfig.url}${markdownPath}`
  const prompt = `Read ${markdownUrl}, then help me apply it to my project.`

  const track = (event: string) => {
    ;(window as any).FS?.event?.(event, { markdown_url: markdownUrl })
  }

  const flash = (state: CopyState) => {
    if (!mounted.current) {
      return
    }
    setCopyState(state)
    clearTimeout(resetTimeout.current)
    resetTimeout.current = setTimeout(() => setCopyState('idle'), RESET_DELAY)
  }

  // Not `async`: everything up to `copyPendingText` has to run in the click's
  // own tick, or the clipboard write lands outside the user activation that
  // Safari requires. The fetch is started here and handed over still pending.
  const copyMarkdown = () => {
    const markdown = fetch(markdownPath, {
      headers: { Accept: 'text/markdown, text/plain' },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Fetching ${markdownPath} failed: ${response.status}`)
      }
      return response.text()
    })

    return copyPendingText(markdown).then(
      (copied) => {
        if (!copied) {
          flash('error')
          return
        }
        track('Copied Page Markdown')
        flash('copied')
      },
      () => flash('error')
    )
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const runAction = (action: string | undefined) => {
    switch (action) {
      case 'copy':
        void copyMarkdown()
        return
      case 'view':
        track('Viewed Page Markdown')
        openInNewTab(markdownPath)
        return
      case 'chatgpt':
        track('Opened Page Markdown in ChatGPT')
        openInNewTab(
          `https://chatgpt.com/?hints=search&prompt=${encodeURIComponent(prompt)}`
        )
        return
      case 'claude':
        track('Opened Page Markdown in Claude')
        openInNewTab(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`)
    }
  }

  const items: SelectItem[] = [
    {
      value: 'copy',
      label: 'Copy page as Markdown',
      iconLeft: <Icon name="general-clipboard" />,
    },
    {
      value: 'view',
      label: 'View as Markdown',
      iconLeft: <Icon name="document-text" />,
    },
    { type: 'divider' },
    {
      value: 'chatgpt',
      label: 'Open in ChatGPT',
      iconLeft: <Icon name="general-sparkle-triple" />,
      iconRight: <Icon name="arrow-top-right" />,
    },
    {
      value: 'claude',
      label: 'Open in Claude',
      iconLeft: <Icon name="general-sparkle-triple" />,
      iconRight: <Icon name="arrow-top-right" />,
    },
  ]

  const variant =
    colorMode === 'dark' ? 'outline-indigo-dark-mode' : 'outline-indigo'

  return (
    // Page chrome, not content: keep the whole control out of the LLM export.
    <div className={s.markdownActions} data-sanitize="">
      <Button
        variant={variant}
        size="32"
        onClick={copyMarkdown}
        aria-label="Copy page as Markdown"
        className={s.copyButton}
      >
        <Icon
          name={copyState === 'copied' ? 'checkmark' : 'general-clipboard'}
          className="mr-1"
        />
        {LABELS[copyState]}
      </Button>
      <Select
        items={items}
        // Always-empty value: these rows are one-shot actions, so none of them
        // should come back rendered as the current selection. Passing a defined
        // value also keeps `Select` in controlled mode, so it never tracks one
        // internally.
        value=""
        onChange={runAction}
        onOpenChange={(open) => open && track('Opened Page Markdown Menu')}
        align="right"
        // The docs content column is narrow, and the longest row is
        // "Copy page as Markdown".
        minWidth={220}
        theme={colorMode === 'dark' ? 'dark' : 'light'}
        trigger={({ open, toggle }) => (
          <Button
            variant={variant}
            size="32"
            square
            onClick={toggle}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="More page formats"
            className={s.menuButton}
          >
            <Icon
              name={open ? 'chevron-up-small' : 'chevron-down-small'}
              aria-hidden="true"
            />
          </Button>
        )}
      />
      <span aria-live="polite" className={s.srOnly}>
        {copyState === 'copied' ? 'Page markdown copied to clipboard' : ''}
        {copyState === 'error' ? 'Copying the page markdown failed' : ''}
      </span>
    </div>
  )
}
