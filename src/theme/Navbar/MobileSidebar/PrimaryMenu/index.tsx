import React from 'react'
import { useThemeConfig } from '@docusaurus/theme-common'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import {
  useActiveDocContext,
  useDocsPreferredVersion,
  useVersions,
} from '@docusaurus/plugin-content-docs/client'
import Link from '@docusaurus/Link'
import {
  IconChevronRightSmall,
  IconArrowTopRight,
} from '@cypress-design/react-icon'

const LINK_CLASS =
  'flex items-center justify-between my-[8px] py-[8px] px-[12px] text-gray-700 bg-transparent hover:bg-transparent dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items
}

// Stands in for the navbar's version dropdown, which is hidden below sm.
function VersionLinks() {
  const mobileSidebar = useNavbarMobileSidebar()
  const versions = useVersions(undefined)
  const { activeVersion, alternateDocVersions } = useActiveDocContext(undefined)
  const { savePreferredVersionName } = useDocsPreferredVersion(undefined)
  if (!activeVersion || versions.length < 2) return null

  return (
    <>
      <li className="px-[12px] pt-[16px] text-[14px] font-semibold text-gray-600 dark:text-gray-400 sm:hidden">
        Docs version
      </li>
      {versions.map((version) => {
        const doc =
          alternateDocVersions[version.name] ??
          version.docs.find((d) => d.id === version.mainDocId)
        const current = version.name === activeVersion.name
        return (
          <Link
            className={`${LINK_CLASS} sm:!hidden`}
            to={doc.path}
            key={version.name}
            aria-current={current ? 'page' : undefined}
            onClick={() => {
              savePreferredVersionName(version.name)
              mobileSidebar.toggle()
            }}
          >
            {current ? <b>{version.label}</b> : version.label}
            <IconChevronRightSmall />
          </Link>
        )
      })}
    </>
  )
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar()
  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const items = (useNavbarItems() as any[]).filter(
    (item) => item.type !== 'docsVersionDropdown'
  )
  return (
    <ul className="menu__list">
      {items.map((item, i) => (
        <Link
          className={LINK_CLASS}
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
      <VersionLinks />
    </ul>
  )
}
