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
 * The canonical order operating-system tabs are always displayed in:
 * macOS first, Windows last. Any `<TabItem>` whose `value` isn't listed here
 * keeps its authored position, after the known operating systems.
 */
const OS_ORDER = ['macos', 'linux', 'windows']

const orderIndex = (child: React.ReactNode): number => {
  if (!React.isValidElement(child)) {
    return OS_ORDER.length
  }
  const index = OS_ORDER.indexOf(child.props.value)
  return index === -1 ? OS_ORDER.length : index
}

/**
 * A reusable Linux / macOS / Windows tab set.
 *
 * Wrap each operating system's content in a `<TabItem>` using one of the
 * canonical values below. The tabs are always displayed with macOS first and
 * Windows last regardless of the order they're authored in:
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
  // Sort into the canonical operating-system order. `React.Children.toArray`
  // drops whitespace-only children and assigns stable keys, and `sort` is
  // stable, so unknown tabs keep their relative authored order.
  const orderedChildren = React.Children.toArray(children).sort(
    (a, b) => orderIndex(a) - orderIndex(b)
  )

  return <Tabs groupId={groupId}>{orderedChildren}</Tabs>
}

export default OsTabs
