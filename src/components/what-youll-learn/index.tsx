import React from 'react'
import CalloutLabel from '@site/src/components/callout-label'

interface WhatYoullLearnProps {
  color?: string
}

/**
 * The "What you'll learn" label used at the top of many docs pages inside an
 * `:::info` admonition. Thin wrapper around {@link CalloutLabel} so the many
 * `<WhatYoullLearn />` usages across the docs stay concise.
 */
export default function WhatYoullLearn({
  color = '#4BBFD2',
}: WhatYoullLearnProps): JSX.Element {
  return (
    <CalloutLabel icon="question-circle" color={color}>
      What you'll learn
    </CalloutLabel>
  )
}
