import React, { useState } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal'
import { translate } from '@docusaurus/Translate'
import DocMenu from '@cypress-design/react-docmenu'
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

function setActiveRecursively(sidebarItems, activePath) {
  const activeElements = sidebarItems?.filter((item) => {
    if (activePath === item.href) {
      return true
    }

    if (setActiveRecursively(item.items, activePath)) {
      item.collapsed = false
      return true
    }
  })

  return Boolean(activeElements?.length)
}

export default function DocSidebarDesktopContent({ path, sidebar, className }) {
  const showAnnouncementBar = useShowAnnouncementBar()
  setActiveRecursively(sidebar, path)

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
      <div className="p-[24px] text-left">
        <DocMenu items={sidebar} LinkComponent={Link} activePath={path} />
      </div>
    </nav>
  )
}
