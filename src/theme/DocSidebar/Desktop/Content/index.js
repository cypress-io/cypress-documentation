import React, { useState } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal'
import { translate } from '@docusaurus/Translate'
import DocMenu from '@cypress-design/react-docmenu'
import Tag from '@cypress-design/react-tag'
import styles from './styles.module.css'

function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar()
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive)
  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0)
      }
    },
    [isActive]
  )
  return isActive && showAnnouncementBar
}

function cloneSidebarWithActivePathExpanded(sidebarItems, activePath) {
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

function SidebarLink({ children, customProps, className, href, style }) {
  return (
    <Link {...{ className, href, style }}>
      {children}{' '}
      {customProps?.new_label ? (
        <Tag color="indigo" size="16" dark style={{ marginTop: '-2px' }}>
          New
        </Tag>
      ) : null}
    </Link>
  )
}

export default function DocSidebarDesktopContent({ path, sidebar, className }) {
  const showAnnouncementBar = useShowAnnouncementBar()
  const { items } = cloneSidebarWithActivePathExpanded(sidebar, path)

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx(
        'menu thin-scrollbar',
        styles.menu,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
        className
      )}
    >
      <div className="p-[8px] text-left">
        <DocMenu
          items={items}
          LinkComponent={SidebarLink}
          activePath={path}
          collapsible
        />
      </div>
    </nav>
  )
}
