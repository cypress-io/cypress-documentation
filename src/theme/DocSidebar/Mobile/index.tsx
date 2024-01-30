import React from 'react'
import { NavbarSecondaryMenuFiller } from '@docusaurus/theme-common'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import DocMenu from '@cypress-design/react-docmenu'
import { cloneSidebarWithActivePathExpanded } from '../utils'
import { SidebarLink } from '../SidebarLink'

interface DocSidebarMobileSecondaryMenuProps {
  sidebar: any
  path: string
}

// eslint-disable-next-line react/function-component-definition
const DocSidebarMobileSecondaryMenu = ({
  sidebar,
  path,
}: DocSidebarMobileSecondaryMenuProps) => {
  const mobileSidebar = useNavbarMobileSidebar()
  const { items } = cloneSidebarWithActivePathExpanded(sidebar, path)
  return (
    <DocMenu
      items={items}
      LinkComponent={(props) => (
        <SidebarLink
          {...props}
          onClick={() => {
            mobileSidebar.toggle()
          }}
        />
      )}
      activePath={path}
      collapsible
    />
  )
}

function DocSidebarMobile(props: any) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  )
}
export default React.memo(DocSidebarMobile)
