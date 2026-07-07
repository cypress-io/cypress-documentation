import React from 'react'
import Icon from '@site/src/components/icon'

interface CalloutLabelProps {
  /** Font Awesome icon name shown before the label text. */
  icon: string
  /** Icon color. */
  color?: string
  /** Label text. */
  children: React.ReactNode
}

/**
 * An icon + text label used at the top of an `:::info` admonition (for
 * example "What you'll learn" or "Examples and use cases").
 *
 * These were previously authored as `##### ` (h5) headings placed directly
 * after the page's h1, which skips heading levels and fails the axe-core
 * `heading-order` rule. They are decorative callout labels rather than
 * document sections, so they render as a non-heading `<p>` styled to look
 * identical to the original h5 (see `.callout-label` in
 * `src/css/markdown.scss`).
 */
export default function CalloutLabel({
  icon,
  color = '#4BBFD2',
  children,
}: CalloutLabelProps): JSX.Element {
  return (
    <p className="callout-label">
      <Icon name={icon} color={color} /> {children}
    </p>
  )
}
