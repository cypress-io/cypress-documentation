import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme/CodeBlock'

interface PackageManagerTabsProps {
  /**
   * A package (or space-separated packages) to install as a dependency, e.g.
   * `cypress` or `cypress@13.5.0`. Rendered as `npm install` / `yarn add` /
   * `pnpm add` / `bun add`. Mutually exclusive with `run` and `exec`.
   */
  install?: string
  /**
   * A command provided by an installed dependency, e.g. `cypress open`.
   * Rendered as `npx` / `yarn` / `pnpm` / `bunx`. Multiple alternative
   * commands can be provided on separate lines. Mutually exclusive with
   * `install` and `exec`.
   */
  run?: string
  /**
   * A one-off command to download and run without installing, e.g.
   * `create-react-app my-app`. Rendered as `npx` / `yarn dlx` / `pnpm dlx` /
   * `bunx`. Mutually exclusive with `install` and `run`.
   */
  exec?: string
  /**
   * With `install`, save the package as a dev dependency (`--save-dev` /
   * `--dev`).
   */
  dev?: boolean
  /**
   * Optional environment variable assignment(s) to prepend before each
   * command, e.g. `CYPRESS_RECORD_KEY=abc123`.
   */
  env?: string
}

/**
 * How each supported package manager expresses the three kinds of command.
 * `install` is a function because flag placement differs between managers.
 */
const managers = [
  {
    value: 'npm',
    label: 'npm',
    install: (pkg: string, dev: boolean) =>
      `npm install ${pkg}${dev ? ' --save-dev' : ''}`,
    run: 'npx',
    exec: 'npx',
  },
  {
    value: 'yarn',
    label: 'Yarn',
    install: (pkg: string, dev: boolean) =>
      `yarn add ${pkg}${dev ? ' --dev' : ''}`,
    run: 'yarn',
    exec: 'yarn dlx',
  },
  {
    value: 'pnpm',
    label: 'pnpm',
    install: (pkg: string, dev: boolean) =>
      `pnpm add ${dev ? '--save-dev ' : ''}${pkg}`,
    run: 'pnpm',
    exec: 'pnpm dlx',
  },
  {
    value: 'bun',
    label: 'Bun',
    install: (pkg: string, dev: boolean) =>
      `bun add ${dev ? '--dev ' : ''}${pkg}`,
    run: 'bunx',
    exec: 'bunx',
  },
]

const toLines = (value: string): string[] =>
  value
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

/**
 * Renders a command across the supported package managers (npm, Yarn, pnpm,
 * and Bun) as a synced tab group, so a single source command stays DRY.
 * Provide exactly one of:
 *
 * - `install` — add a dependency: `<PackageManagerTabs install="cypress" dev />`
 * - `run` — run an installed dependency's binary: `<PackageManagerTabs run="cypress open" />`
 * - `exec` — download and run a one-off command: `<PackageManagerTabs exec="skills update" />`
 *
 * All instances share `groupId="package-manager"`, so a reader's choice syncs
 * across the whole site and is remembered between visits.
 */
const PackageManagerTabs: React.FC<PackageManagerTabsProps> = ({
  install,
  run,
  exec,
  dev = false,
  env,
}) => {
  const provided = [install, run, exec].filter(
    (value) => value !== undefined
  ).length
  if (provided !== 1) {
    throw new Error(
      'PackageManagerTabs requires exactly one of the `install`, `run`, or `exec` props'
    )
  }

  const envPrefix = env ? `${env} ` : ''
  const lines = toLines(install ?? run ?? exec ?? '')

  return (
    <Tabs groupId="package-manager">
      {managers.map((manager) => {
        const commands = install
          ? [manager.install(lines.join(' '), dev)]
          : lines.map((line) => `${run ? manager.run : manager.exec} ${line}`)

        return (
          <TabItem key={manager.value} value={manager.value} label={manager.label}>
            <CodeBlock language="shell">
              {commands.map((command) => `${envPrefix}${command}`).join('\n')}
            </CodeBlock>
          </TabItem>
        )
      })}
    </Tabs>
  )
}

export default PackageManagerTabs
