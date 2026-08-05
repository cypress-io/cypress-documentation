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
   * With `install`, install the package globally (`npm install --global` /
   * `yarn global add` / `pnpm add --global` / `bun add --global`). Use for
   * CLIs meant to be available on the user's PATH. Takes precedence over
   * `dev`.
   */
  global?: boolean
  /**
   * Optional environment variable assignment(s) to prepend before each
   * command, e.g. `CYPRESS_RECORD_KEY=abc123`.
   */
  env?: string
  /**
   * Comma-separated package-manager values to omit from the tabs, e.g.
   * `"bun"`. Use when a command isn't portable to a given manager.
   */
  exclude?: string
}

/**
 * How each supported package manager expresses the three kinds of command.
 * `install` is a function because flag placement differs between managers.
 */
const managers = [
  {
    value: 'npm',
    label: 'npm',
    install: (pkg: string, dev: boolean, global: boolean) =>
      global
        ? `npm install --global ${pkg}`
        : `npm install ${pkg}${dev ? ' --save-dev' : ''}`,
    run: 'npx',
    exec: 'npx',
  },
  {
    value: 'yarn',
    label: 'Yarn',
    install: (pkg: string, dev: boolean, global: boolean) =>
      global
        ? `yarn global add ${pkg}`
        : `yarn add ${pkg}${dev ? ' --dev' : ''}`,
    run: 'yarn',
    exec: 'yarn dlx',
  },
  {
    value: 'pnpm',
    label: 'pnpm',
    install: (pkg: string, dev: boolean, global: boolean) =>
      global
        ? `pnpm add --global ${pkg}`
        : `pnpm add ${dev ? '--save-dev ' : ''}${pkg}`,
    run: 'pnpm',
    exec: 'pnpm dlx',
  },
  {
    value: 'bun',
    label: 'Bun',
    install: (pkg: string, dev: boolean, global: boolean) =>
      global
        ? `bun add --global ${pkg}`
        : `bun add ${dev ? '--dev ' : ''}${pkg}`,
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
 * - `install` + `global` — install a CLI globally: `<PackageManagerTabs install="@cypress/cloud" global />`
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
  global = false,
  env,
  exclude,
}) => {
  const provided = [install, run, exec].filter(
    (value) => value !== undefined
  ).length
  if (provided !== 1) {
    throw new Error(
      'PackageManagerTabs requires exactly one of the `install`, `run`, or `exec` props'
    )
  }
  if (global && install === undefined) {
    throw new Error(
      'PackageManagerTabs `global` can only be used with the `install` prop'
    )
  }

  const envPrefix = env ? `${env} ` : ''
  const lines = toLines(install ?? run ?? exec ?? '')
  const excluded = new Set(
    (exclude ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  )
  const visibleManagers = managers.filter(
    (manager) => !excluded.has(manager.value)
  )

  return (
    <Tabs groupId="package-manager">
      {visibleManagers.map((manager) => {
        const commands = install
          ? [manager.install(lines.join(' '), dev, global)]
          : lines.map((line) => `${run ? manager.run : manager.exec} ${line}`)

        return (
          <TabItem
            key={manager.value}
            value={manager.value}
            label={manager.label}
          >
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
