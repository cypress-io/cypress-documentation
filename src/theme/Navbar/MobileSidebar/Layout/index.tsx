import React from 'react'
import clsx from 'clsx'
import { useNavbarSecondaryMenu } from '@docusaurus/theme-common/internal'

interface NavbarMobileSidebarLayoutProps {
  header: React.ReactNode
  primaryMenu: React.ReactNode
  secondaryMenu: React.ReactNode
}

export default function NavbarMobileSidebarLayout({
  header,
  primaryMenu,
  secondaryMenu,
}: NavbarMobileSidebarLayoutProps) {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu()
  return (
    <div className="navbar-sidebar">
      {header}
      <div
        className={clsx('navbar-sidebar__items', {
          'navbar-sidebar__items--show-secondary': secondaryMenuShown,
        })}
      >
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
        <div className="navbar-sidebar__item menu mx-[8px]">
          {secondaryMenu}
        </div>
      </div>
    </div>
  )
}
