import React from 'react'
import { useThemeConfig, ErrorCauseBoundary } from '@docusaurus/theme-common'
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal'
import NavbarItem from '@theme/NavbarItem'
import SearchBar from '@theme/SearchBar'
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle'
import NavbarLogo from '@theme/Navbar/Logo'
import NavbarSearch from '@theme/Navbar/Search'
import { SocialIcons } from './SocialIcons'
function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items
}

function NavbarItems({ items }: { items: any[] }) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              { cause: error }
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  )
}

function NavbarContentLayout({ left, center, right }: any) {
  return (
    <div className="navbar__inner">
      <div className="navbar__items navbar__items--left">{left}</div>
      <div className="hidden navbar__items lg:flex">{center}</div>
      <div className="navbar__items navbar__items--right mr-[32px] lg:mr-0">
        {right}
      </div>
    </div>
  )
}
export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar()
  const items = useNavbarItems()
  const [leftItems, rightItems] = splitNavbarItems(items)
  const searchBarItem = items.find((item) => item.type === 'search')
  return (
    <NavbarContentLayout
      left={
        <>
          <NavbarMobileSidebarToggle
            className="navbar__toggle"
            sidebarShown={mobileSidebar.sidebarShown}
            setSidebarShown={mobileSidebar.setSidebarShown}
            aria-label="Navigation Menu"
          />
          <NavbarLogo
            className="navbar__brand"
            imageClassName="navbar__logo"
            titleClassName="navbar__title"
          />
        </>
      }
      center={<NavbarItems items={leftItems} />}
      right={
        // TODO stop hardcoding items?
        // Ask the user to add the respective navbar items => more flexible
        <>
          {!searchBarItem && (
            <NavbarSearch>
              <SearchBar />
            </NavbarSearch>
          )}
          <SocialIcons className="hidden sm:flex" />
        </>
      }
    />
  )
}
