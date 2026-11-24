import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import {
  useActiveDocContext,
  useDocsPreferredVersion,
  useVersions,
} from '@docusaurus/plugin-content-docs/client'
import styles from './style.module.css'

// src/css/navbar.scss adds this bar's height to the page's sticky offsets.
export default function DocsVersionBar() {
  const versions = useVersions(undefined)
  const { activeVersion, alternateDocVersions } = useActiveDocContext(undefined)
  const { savePreferredVersionName } = useDocsPreferredVersion(undefined)
  if (!activeVersion || activeVersion.isLast) return null

  const latest = versions.find((version) => version.isLast)
  if (!latest) return null
  const latestDoc = alternateDocVersions[latest.name]
  const target =
    latestDoc ?? latest.docs.find((doc) => doc.id === latest.mainDocId)

  return (
    <div className={clsx('alert alert--warning', styles.bar)} role="status">
      <span className="hidden sm:inline">
        You're viewing docs for Cypress <b>{activeVersion.label}</b>.{' '}
      </span>
      <span className="sm:hidden">
        Cypress <b>{activeVersion.label}</b> docs.{' '}
      </span>
      <Link
        to={target.path}
        onClick={() => savePreferredVersionName(latest.name)}
      >
        <span className="hidden sm:inline">
          {latestDoc
            ? 'See this page in the latest version'
            : 'Go to the latest docs'}
        </span>
        <span className="sm:hidden">See latest</span>
      </Link>
    </div>
  )
}
