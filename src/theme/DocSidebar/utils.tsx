export function cloneSidebarWithActivePathExpanded(sidebarItems, activePath) {
  let hasActive = false
  const items = sidebarItems.map((item) => {
    if (item.items) {
      const { items, hasActive: localHasActive } =
        cloneSidebarWithActivePathExpanded(item.items, activePath)
      hasActive = hasActive || localHasActive
      return {
        ...item,
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
