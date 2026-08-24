import * as React from 'react'
import { SidebarAdornments } from './SidebarLink'

/**
 * Fold a category's `customProps` adornments into its label.
 *
 * Doc links receive their `customProps` because the doc menu spreads the whole
 * item onto `LinkComponent`. Categories never reach `LinkComponent` at all: the
 * menu renders them from `label`, so their `customProps` would otherwise be
 * dropped. `label` is only ever rendered as a React child, so a node is safe
 * here.
 */
function categoryLabel(item: any): React.ReactNode {
  const { ai_icon, new_label, deprecated_label } = item.customProps ?? {}
  if (!ai_icon && !new_label && !deprecated_label) {
    return item.label
  }
  return (
    <>
      {item.label} <SidebarAdornments customProps={item.customProps} />
    </>
  )
}

export function cloneSidebarWithActivePathExpanded(
  sidebarItems: any[],
  activePath: string
): any {
  let hasActive = false
  const items = sidebarItems.map((item) => {
    if (item.items) {
      const { items, hasActive: localHasActive } =
        cloneSidebarWithActivePathExpanded(item.items, activePath)
      hasActive = hasActive || localHasActive
      return {
        ...item,
        label: categoryLabel(item),
        items,
        collapsed: !localHasActive,
      }
    } else {
      if (item.href === activePath) {
        hasActive = true
      }
      return { ...item }
    }
  })
  return { items, hasActive }
}
