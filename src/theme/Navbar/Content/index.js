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
import {
  IconSocialGithubSolid,
  IconSocialDiscordSolid,
} from '@cypress-design/react-icon'
import styles from './styles.module.css'
function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items
}
function NavbarItems({ items }) {
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
function NavbarContentLayout({ left, center, right }) {
  return (
    <div className="navbar__inner">
      <div className="navbar__items navbar__items--left">{left}</div>
      <div className="hidden navbar__items lg:flex">{center}</div>
      <div className="navbar__items navbar__items--right mr-[32px] md:mr-0">
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
          <div className="hidden sm:flex rounded-full divide-x dark:divide-gray-700 bg-gray-50 dark:bg-gray-900 p-[6px] !px-[2px] text-indigo-500 dark:text-indigo-300">
            <a
              href="https://github.com/cypress-io/cypress-documentation"
              className="!px-[12px] !py-[4px]"
            >
              <span className="sr-only">Cypress GitHub repository</span>
              <IconSocialGithubSolid />
            </a>
            <a
              href="https://on.cypress.io/discord"
              className="!px-[12px] !py-[4px]"
            >
              <span className="sr-only">Cypress Discord</span>
              <IconSocialDiscordSolid />
            </a>
          </div>
        </>
      }
    />
  )
}
