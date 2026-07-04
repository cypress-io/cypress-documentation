import React from 'react'
import Icon from '@site/src/components/icon'

interface WhatYoullLearnProps {
  color?: string
}

/**
 * Renders the "What you'll learn" label used at the top of many docs pages
 * inside an `:::info` admonition.
 *
 * It was previously authored as an `##### ` (h5) heading placed directly after
 * the page's h1, which skips heading levels h2–h4 and fails the axe-core
 * `heading-order` rule. This is a decorative callout label rather than a
 * document section, so it is rendered as a non-heading element that is styled
 * to look identical to the original h5 (see `.what-youll-learn` in
 * `src/css/markdown.scss`).
 */
export default function WhatYoullLearn({
  color = '#4BBFD2',
}: WhatYoullLearnProps): JSX.Element {
  return (
    <p className="what-youll-learn">
      <Icon name="question-circle" color={color} /> What you'll learn
    </p>
  )
}
