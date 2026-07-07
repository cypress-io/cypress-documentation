import React from 'react'
import PackageManagerTabs from '@site/src/components/package-manager-tabs'

interface CypressCommandTabsProps {
  /**
   * The Cypress subcommand and any arguments, i.e. everything that comes after
   * `cypress`. For example `run --headed`. Multiple alternative commands can be
   * provided on separate lines.
   */
  command: string
  /**
   * Optional environment variable assignment(s) to prepend before the command,
   * e.g. `IGNORE_CHROME_PREFERENCES=1`.
   */
  env?: string
}

/**
 * Renders a Cypress command across the supported package managers (npm, Yarn,
 * pnpm, and Bun) as a synced tab group, so a single source command stays DRY.
 * Shorthand for `<PackageManagerTabs run="cypress …" />`.
 */
const CypressCommandTabs: React.FC<CypressCommandTabsProps> = ({
  command,
  env,
}) => {
  const run = command
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `cypress ${line}`)
    .join('\n')

  return <PackageManagerTabs run={run} env={env} />
}

export default CypressCommandTabs
