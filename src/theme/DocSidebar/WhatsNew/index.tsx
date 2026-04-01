import React from 'react'
import Link from '@docusaurus/Link'
import Button from '@cypress-design/react-button'
import Tag from '@cypress-design/react-tag'
import styles from './styles.module.css'
import { getWhatsNewItems } from './whatsNewItems'
import { IconGeneralSparkleDoubleSmall, IconChevronRightMedium } from '@cypress-design/react-icon'


const DISMISS_LOCAL_STORAGE_KEY = 'docs-whats-new-dismissed'

function getSection(path: string) {
  return path.split('/').filter(Boolean)[0] || 'global'
}

function readDismissedFromLocalStorage(section: string) {
  if (typeof window === 'undefined') return false
  return (
    window.localStorage.getItem(`${DISMISS_LOCAL_STORAGE_KEY}-${section}`) ===
    'true'
  )
}

function writeDismissedToLocalStorage(section: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`${DISMISS_LOCAL_STORAGE_KEY}-${section}`, 'true')
}

export default function WhatsNew({ path }: { path: string }) {
  const section = getSection(path)
  const [dismissed, setDismissed] = React.useState(() =>
    readDismissedFromLocalStorage(section)
  )
  const items = getWhatsNewItems(path)

  if (items.length === 0 || dismissed) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Now Available</div>
        <Button
          className={styles.dismiss}
          square
          size={24}
          aria-label="Dismiss now available section"
          onClick={() => {
            writeDismissedToLocalStorage(section)
            setDismissed(true)
          }}
        >
          ×
        </Button>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <Link className={styles.link} href={item.href}>
              <span className={styles.linkContent}>
                <span className={styles.itemTitle}>
                  <span>{item.label}</span>
                  {item.showAISparkle && 
                    <IconGeneralSparkleDoubleSmall fillColor="transparent" className="inline" />
                  }
                  {item.isNew && (
                    <Tag color="indigo" size="16" dark>
                      New
                    </Tag>
                  )}
                </span>
                {item.description && (
                  <span className={styles.description}>{item.description}</span>
                )}
              </span>
              <IconChevronRightMedium
                className={styles.arrow}
                strokeColor="indigo-500"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
