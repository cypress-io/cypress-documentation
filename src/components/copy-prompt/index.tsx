import React, { useEffect, useId, useRef, useState } from 'react'
import { useColorMode } from '@docusaurus/theme-common'
import Button from '@cypress-design/react-button'
import Icon from '@cypress-design/react-icon'
import s from './style.module.css'

interface CopyPromptProps {
  /** Full prompt text; the copy button always copies all of it. */
  prompt: string
  title?: string
  subtext?: string
}

const DEFAULT_TITLE = 'Do this migration with your AI assistant'
const DEFAULT_SUBTEXT =
  'Copies a ready-made prompt for Claude Code, Cursor, or Copilot.'

/**
 * Card offering a ready-made prompt for the reader's AI coding assistant,
 * e.g. to walk a project through a version migration. data-sanitize keeps
 * the card out of the LLM markdown export.
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
      // Clipboard API is unavailable in insecure contexts
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
          // variant/size lack types without @cypress-design/constants-button;
          // same workaround as src/components/button
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
      {/* stays in the DOM when collapsed; CSS hides it */}
      <p
        id={promptId}
        className={expanded ? s.promptText : s.promptTextCollapsed}
      >
        &ldquo;{prompt}&rdquo;
      </p>
      <span aria-live="polite" className={s.srOnly}>
        {copied ? 'Prompt copied to clipboard' : ''}
      </span>
    </section>
  )
}
