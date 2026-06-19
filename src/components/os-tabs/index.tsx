import React from 'react'
import Tabs from '@theme/Tabs'

interface OsTabsProps {
  children: React.ReactNode
  /**
   * Override the default groupId. Leave unset so that an operating-system
   * choice made in one `OsTabs` stays in sync with every other `OsTabs` on
   * the page (and is remembered across the site).
   */
  groupId?: string
}

/**
 * A reusable Linux / macOS / Windows tab set.
 *
 * Wrap each operating system's content in a `<TabItem>` using one of the
 * canonical values below so that the tabs render and sync consistently:
 *
 * ```mdx
 * <OsTabs>
 *   <TabItem value="linux" label="Linux">Linux instructions…</TabItem>
 *   <TabItem value="macos" label="macOS">macOS instructions…</TabItem>
 *   <TabItem value="windows" label="Windows">Windows instructions…</TabItem>
 * </OsTabs>
 * ```
 *
 * All `OsTabs` share the same `groupId` by default, so choosing an operating
 * system in one place updates every other `OsTabs` on the page.
 */
const OsTabs: React.FC<OsTabsProps> = ({
  children,
  groupId = 'operating-systems',
}) => {
  return <Tabs groupId={groupId}>{children}</Tabs>
}

export default OsTabs
