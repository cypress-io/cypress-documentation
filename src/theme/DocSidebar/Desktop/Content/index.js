import React, { useState } from 'react'
import clsx from 'clsx'
import { ThemeClassNames } from '@docusaurus/theme-common'
import Link from '@docusaurus/Link'
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal'
import { translate } from '@docusaurus/Translate'
import DocSidebarItems from '@theme/DocSidebarItems'
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
  sidebarItems?.forEach((item) => {
    if (activePath === item.href) {
      item.active = true
      return
    }
    setActiveRecursively(item.items, activePath)
  })
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
      <DocMenu items={sidebar} LinkComponent={Link} />
    </nav>
  )
}
