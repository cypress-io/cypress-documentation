import React from 'react'
import { IconChevronLeftSmall } from '@cypress-design/react-icon'
import { useThemeConfig } from '@docusaurus/theme-common'
import { useNavbarSecondaryMenu } from '@docusaurus/theme-common/internal'
import Translate from '@docusaurus/Translate'
function SecondaryMenuBackButton(
  props: Omit<React.ComponentProps<'button'>, 'type'>
) {
  return (
    <>
      <button
        {...props}
        type="button"
        className="flex items-center px-1 clean-btn navbar-sidebar__back gap-[4px] hover:text-teal-700 dark:hover:text-teal-100"
      >
        <IconChevronLeftSmall />
        <Translate
          id="theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel"
          description="The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)"
        >
          Back to main menu
        </Translate>
      </button>
      <hr className="h-[1px] bg-gray-100 dark:bg-gray-800 mr-[16px]" />
    </>
  )
}
// The secondary menu slides from the right and shows contextual information
// such as the docs sidebar
export default function NavbarMobileSidebarSecondaryMenu() {
  const isPrimaryMenuEmpty = useThemeConfig().navbar.items.length === 0
  const secondaryMenu = useNavbarSecondaryMenu()
  return (
    <>
      {/* edge-case: prevent returning to the primaryMenu when it's empty */}
      {!isPrimaryMenuEmpty && (
        <SecondaryMenuBackButton onClick={() => secondaryMenu.hide()} />
      )}
      <div className="my-[8px]">{secondaryMenu.content}</div>
    </>
  )
}
