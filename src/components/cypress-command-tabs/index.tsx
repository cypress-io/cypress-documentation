import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme/CodeBlock'

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

const runners = [
  { value: 'npm', label: 'npm', runner: 'npx cypress' },
  { value: 'yarn', label: 'Yarn', runner: 'yarn cypress' },
  { value: 'pnpm', label: 'pnpm', runner: 'pnpm cypress' },
  { value: 'bun', label: 'Bun', runner: 'bunx cypress' },
]

/**
 * Renders a Cypress command across the supported package managers (npm, Yarn,
 * pnpm, and Bun) as a synced tab group, so a single source command stays DRY.
 */
const CypressCommandTabs: React.FC<CypressCommandTabsProps> = ({
  command,
  env,
}) => {
  const lines = command
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const envPrefix = env ? `${env} ` : ''

  return (
    <Tabs groupId="package-manager">
      {runners.map(({ value, label, runner }) => (
        <TabItem key={value} value={value} label={label}>
          <CodeBlock language="shell">
            {lines.map((line) => `${envPrefix}${runner} ${line}`).join('\n')}
          </CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  )
}

export default CypressCommandTabs
