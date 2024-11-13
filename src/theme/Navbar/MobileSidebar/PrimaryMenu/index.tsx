import React from 'react'
import { useThemeConfig } from '@docusaurus/theme-common'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import Link from '@docusaurus/Link'
import {
  IconChevronRightSmall,
  IconArrowTopRight,
} from '@cypress-design/react-icon'

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items
}
// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar()
  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const items = useNavbarItems() as any[]
  return (
    <ul className="menu__list">
      {items.map((item, i) => (
        <Link
          className="flex items-center justify-between my-[8px] py-[8px] px-[12px] text-gray-700 bg-transparent hover:bg-transparent dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          mobile
          {...item}
          onClick={() => mobileSidebar.toggle()}
          key={i}
        >
          {item.label}
          {item.to?.startsWith('http') ? (
            <IconArrowTopRight stroke-color="jade-300" />
          ) : (
            <IconChevronRightSmall />
          )}
        </Link>
      ))}
    </ul>
  )
}
