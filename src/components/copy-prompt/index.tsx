import React, { useEffect, useId, useRef, useState } from 'react'
import { useColorMode } from '@docusaurus/theme-common'
import Button from '@cypress-design/react-button'
import Icon from '@cypress-design/react-icon'
import s from './style.module.css'

interface CopyPromptProps {
  /** The full prompt text; always what the copy button copies. */
  prompt: string
  /** Per-card heading naming the outcome, e.g. "Upgrade to Cypress 15 with your AI assistant". */
  title?: string
  /** One-line supporting text under the title. */
  subtext?: string
}

const DEFAULT_TITLE = 'Do this migration with your AI assistant'
const DEFAULT_SUBTEXT =
  'Copies a ready-made prompt for Claude Code, Cursor, or Copilot.'

/**
 * A copyable AI prompt used in guides to hand readers a ready-made prompt for
 * their AI coding assistant, e.g. to walk a project through a version
 * migration. Renders as a light, admonition-weight card: title, one-line
 * supporting text, a copy button, and a "Show prompt" disclosure that reveals
 * the full prompt (kept in the DOM and hidden with CSS when collapsed).
 * The whole card carries data-sanitize so the LLM export drops it — an AI
 * reading the exported page needs the page's content, not the prompt card.
 */
export default function CopyPrompt({
  prompt,
  title = DEFAULT_TITLE,
  subtext = DEFAULT_SUBTEXT,
}: CopyPromptProps): React.JSX.Element {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const promptId = useId()
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )
  const { colorMode } = useColorMode()

  useEffect(() => () => clearTimeout(resetTimeout.current), [])

  const copyPrompt = async () => {
    let succeeded = false
    try {
      await navigator.clipboard.writeText(prompt)
      succeeded = true
    } catch {
      // Clipboard API unavailable (e.g. insecure context); fall back to a
      // hidden textarea + execCommand copy.
      const textarea = document.createElement('textarea')
      textarea.value = prompt
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      try {
        textarea.select()
        succeeded = document.execCommand('copy')
      } catch {
        succeeded = false
      } finally {
        document.body.removeChild(textarea)
      }
    }
    if (!succeeded) {
      return
    }
    ;(window as any).FS?.event?.('Copied AI Prompt', { prompt_title: title })
    setCopied(true)
    clearTimeout(resetTimeout.current)
    resetTimeout.current = setTimeout(() => setCopied(false), 3000)
  }

  return (
    <section className={s.copyPrompt} data-sanitize="">
      <p className={s.title}>
        <Icon
          name="general-sparkle-triple"
          className={s.sparkle}
          aria-hidden="true"
        />
        {title}
      </p>
      <p className={s.subtext}>{subtext}</p>
      <div className={s.actions}>
        <Button
          // variant/size are untyped until @cypress-design/constants-button
          // ships its types; same workaround as src/components/button
          {...({
            variant:
              colorMode === 'dark'
                ? 'outline-indigo-dark-mode'
                : 'outline-indigo',
            size: 32,
          } as any)}
          onClick={copyPrompt}
          aria-label="Copy prompt to clipboard"
        >
          <Icon
            name={copied ? 'checkmark' : 'general-clipboard'}
            className="mr-1"
          />
          {copied ? 'Copied' : 'Copy prompt'}
        </Button>
        <button
          type="button"
          className={s.toggle}
          aria-expanded={expanded}
          aria-controls={promptId}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Hide prompt' : 'Show prompt'}
          <Icon
            name={expanded ? 'chevron-up-small' : 'chevron-down-small'}
            className={s.chevron}
            aria-hidden="true"
          />
        </button>
      </div>
      {/* Kept in the DOM when collapsed (display:none removes it from view
          and the a11y tree) so expanding never re-renders mid-read. */}
      <p
        id={promptId}
        className={expanded ? s.promptText : s.promptTextCollapsed}
      >
        &ldquo;{prompt}&rdquo;
      </p>
      {/* polite live region so screen readers announce the copy */}
      <span aria-live="polite" className={s.srOnly}>
        {copied ? 'Prompt copied to clipboard' : ''}
      </span>
    </section>
  )
}
