import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons'
import s from './style.module.css'

interface CopyPromptProps {
  /** The prompt text shown in the card and copied to the clipboard. */
  prompt: string
  /**
   * Short hint rendered under the button. Defaults to a generic "paste into
   * your AI assistant" note; pass an empty string to hide it.
   */
  hint?: string
}

const DEFAULT_HINT =
  'Copy this prompt into your AI assistant (Claude, Cursor, Copilot, etc.) to get hands-on help.'

/**
 * A copyable AI prompt, styled like a code block. Used in guides to hand
 * readers a ready-made prompt for their AI coding assistant, e.g. to walk a
 * project through a version migration.
 */
export default function CopyPrompt({
  prompt,
  hint = DEFAULT_HINT,
}: CopyPromptProps): React.JSX.Element {
  const [copied, setCopied] = useState(false)
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  useEffect(() => () => clearTimeout(resetTimeout.current), [])

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall back to a
      // hidden textarea + execCommand copy.
      const textarea = document.createElement('textarea')
      textarea.value = prompt
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    clearTimeout(resetTimeout.current)
    resetTimeout.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={s.copyPrompt}>
      <p className={s.promptText}>&ldquo;{prompt}&rdquo;</p>
      <button
        type="button"
        className={s.copyButton}
        onClick={copyPrompt}
        aria-label="Copy prompt to clipboard"
      >
        <FontAwesomeIcon
          icon={copied ? faCheck : faCopy}
          className={s.copyIcon}
        />
        {copied ? 'Copied!' : 'Copy Prompt'}
      </button>
      {/* polite live region so screen readers announce the copy */}
      <span aria-live="polite" className={s.srOnly}>
        {copied ? 'Prompt copied to clipboard' : ''}
      </span>
      {hint && <p className={s.hint}>{hint}</p>}
    </div>
  )
}
