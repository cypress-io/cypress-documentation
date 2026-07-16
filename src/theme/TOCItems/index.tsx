import React, { type ReactNode, useMemo } from 'react'
import { useThemeConfig } from '@docusaurus/theme-common'
import {
  useFilteredAndTreeifiedTOC,
  type TOCHighlightConfig,
} from '@docusaurus/theme-common/internal'
import TOCItemTree from '@theme/TOCItems/Tree'
import type { Props } from '@theme/TOCItems'
// Local highlight hook with a fix for the last-section highlight bug.
// @see https://github.com/cypress-io/cypress-documentation/issues/6074
import { useTOCHighlight } from './useTOCHighlight'

export default function TOCItems({
  toc,
  className = 'pt-[.1rem] table-of-contents',
  linkClassName = 'table-of-contents__link',
  linkActiveClassName = undefined,
  minHeadingLevel: minHeadingLevelOption,
  maxHeadingLevel: maxHeadingLevelOption,
  ...props
}: Props): ReactNode {
  const themeConfig = useThemeConfig()

  const minHeadingLevel =
    minHeadingLevelOption ?? themeConfig.tableOfContents.minHeadingLevel
  const maxHeadingLevel =
    maxHeadingLevelOption ?? themeConfig.tableOfContents.maxHeadingLevel

  const tocTree = useFilteredAndTreeifiedTOC({
    toc,
    minHeadingLevel,
    maxHeadingLevel,
  })

  const tocHighlightConfig: TOCHighlightConfig | undefined = useMemo(() => {
    if (linkClassName && linkActiveClassName) {
      return {
        linkClassName,
        linkActiveClassName,
        minHeadingLevel,
        maxHeadingLevel,
      }
    }
    return undefined
  }, [linkClassName, linkActiveClassName, minHeadingLevel, maxHeadingLevel])
  useTOCHighlight(tocHighlightConfig)

  return (
    <TOCItemTree
      toc={tocTree}
      className={className}
      linkClassName={linkClassName}
      {...props}
    />
  )
}
