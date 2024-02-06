import clsx from 'clsx'
import {
  IconSocialGithubSolid,
  IconSocialDiscordSolid,
} from '@cypress-design/react-icon'

export const SocialIcons = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      className,
      'rounded-full divide-x dark:divide-gray-700 bg-gray-50 dark:bg-gray-900 p-[6px] !px-[2px] text-indigo-500 dark:text-indigo-300'
    )}
  >
    <a
      href="https://github.com/cypress-io/cypress-documentation"
      className="!px-[12px] !py-[4px]"
    >
      <span className="sr-only">Cypress GitHub repository</span>
      <IconSocialGithubSolid />
    </a>
    <a href="https://on.cypress.io/discord" className="!px-[12px] !py-[4px]">
      <span className="sr-only">Cypress Discord</span>
      <IconSocialDiscordSolid />
    </a>
  </div>
)
