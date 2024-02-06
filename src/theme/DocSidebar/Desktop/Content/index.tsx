import React, { useState } from 'react'
import clsx from 'clsx'
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal'
import { translate } from '@docusaurus/Translate'
import DocMenu from '@cypress-design/react-docmenu'
import styles from './styles.module.css'
import { cloneSidebarWithActivePathExpanded } from '../../utils'
import { SidebarLink } from '../../SidebarLink'

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

export default function DocSidebarDesktopContent({
  path,
  sidebar,
  className,
}: {
  path: string
  sidebar: any
  className: string
}) {
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
        <pre className="text-right">{path}</pre>
        <DocMenu
          items={items}
          LinkComponent={SidebarLink as any}
          activePath={path}
          collapsible
        />
      </div>
    </nav>
  )
}
