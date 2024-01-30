import React from 'react'
import { NavbarSecondaryMenuFiller } from '@docusaurus/theme-common'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import DocMenu from '@cypress-design/react-docmenu'
import { cloneSidebarWithActivePathExpanded } from '../utils'
import { SidebarLink } from '../SidebarLink'

// eslint-disable-next-line react/function-component-definition
const DocSidebarMobileSecondaryMenu = ({ sidebar, path }) => {
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

function DocSidebarMobile(props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  )
}
export default React.memo(DocSidebarMobile)
