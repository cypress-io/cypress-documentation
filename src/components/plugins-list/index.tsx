import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faCog,
  faDownload,
  faStar,
  faExclamationTriangle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import s from './style.module.css'
// @ts-ignore
import pluginsJSON from '@site/src/data/plugins.json'
// @ts-ignore
import generatedJSON from '@site/src/data/plugins-generated.json'
import clsx from 'clsx'

function createMarkup(html) {
  return { __html: html }
}

const GENERATED = (generatedJSON && generatedJSON.plugins) || {}

const BADGE_ORDER = ['official', 'verified', 'community', 'deprecated']

const BADGE_INFO = {
  official: 'Built and maintained by the Cypress team.',
  verified: 'Community-owned and reviewed by the Cypress team.',
  community:
    'Community-owned and not reviewed by Cypress. Evaluate before use.',
  deprecated:
    'No longer maintained, moved, or removed from npm. Look for an alternative.',
}

// Fixed locale + UTC so the server and client render the same string (no
// hydration mismatch). Intl is built in, so no date library is needed.
const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Format an ISO date as e.g. "Jun 2026". */
function formatMonthYear(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return monthYearFormatter.format(d)
}

function monthsSince(iso) {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return null
  return (Date.now() - then) / (1000 * 60 * 60 * 24 * 30.44)
}

function formatDownloads(n) {
  if (typeof n !== 'number') return null
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

/** False during SSR and the first client render, true afterwards. Lets us defer
 *  `Date.now()`-dependent output so server and client markup always match. */
function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

/** Merge a plugin's curated entry with its generated trust metadata. */
function withMeta(plugin) {
  const meta = GENERATED[plugin.name] || {}
  const badge = meta.deprecated ? 'deprecated' : plugin.badge
  return { ...plugin, meta, badge }
}

function Badge({ badge }) {
  if (!badge) return null
  const cls = `badge${badge[0].toUpperCase()}${badge.slice(1)}`
  return (
    <span
      className={`${s.badge} ${s.badgePill} ${s[cls] || ''}`}
      title={BADGE_INFO[badge]}
    >
      {badge}
    </span>
  )
}

function TrustSignals({ meta }) {
  // `stale` depends on the current date, so only evaluate it after mount to
  // keep server and client markup identical during hydration.
  const mounted = useMounted()
  if (!meta) return null
  const updated = formatMonthYear(meta.lastPublished)
  const age = monthsSince(meta.lastPublished)
  const stale = mounted && typeof age === 'number' && age > 18
  const downloads = formatDownloads(meta.weeklyDownloads)
  const npmUrl = meta.npm ? `https://www.npmjs.com/package/${meta.npm}` : null

  const items = []
  if (npmUrl) {
    items.push(
      <a
        key="npm"
        className={s.signal}
        href={npmUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View on npm"
      >
        <span>
          {meta.npm}
          {meta.version ? `@${meta.version}` : ''}
        </span>
      </a>
    )
  }
  if (updated) {
    items.push(
      <span
        key="updated"
        className={clsx(s.signal, stale && s.signalStale)}
        title={
          stale
            ? 'Not published in over 18 months — may be unmaintained.'
            : 'Latest npm publish date.'
        }
      >
        <FontAwesomeIcon icon={faClock} />
        <span>Updated {updated}</span>
      </span>
    )
  }
  if (meta.cypressVersion) {
    items.push(
      <span key="cy" className={s.signal} title="Supported Cypress versions">
        <FontAwesomeIcon icon={faCog} />
        <span>Cypress {meta.cypressVersion}</span>
      </span>
    )
  }
  if (downloads) {
    items.push(
      <span
        key="dl"
        className={s.signal}
        title="npm downloads in the last week"
      >
        <FontAwesomeIcon icon={faDownload} />
        <span>{downloads}/wk</span>
      </span>
    )
  }
  if (typeof meta.stars === 'number') {
    items.push(
      <span key="stars" className={s.signal} title="GitHub stars">
        <FontAwesomeIcon icon={faStar} />
        <span>{meta.stars.toLocaleString('en-US')}</span>
      </span>
    )
  }
  if (!items.length) return null
  return <div className={s.signals}>{items}</div>
}

function PluginCard({ plugin, onSelectTag }) {
  const { meta } = plugin
  return (
    <li className="card" data-cy={`plugin-${plugin.name}`}>
      <div className={s.pluginTitle}>
        <h3>
          <a href={plugin.link} target="_blank" rel="noopener noreferrer">
            {plugin.name}
          </a>
        </h3>
        {plugin.badge && (
          <div className={s.pluginBadge}>
            <Badge badge={plugin.badge} />
          </div>
        )}
      </div>

      <p dangerouslySetInnerHTML={createMarkup(plugin.description)}></p>

      {meta && meta.deprecated && (
        <p className={s.deprecatedNotice}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={s.noticeIcon}
          />
          {meta.deprecatedReason || 'This plugin is no longer maintained.'}
        </p>
      )}

      <TrustSignals meta={meta} />

      <div className={s.keywords}>
        {plugin.keywords?.map((keyword, index) => (
          <a
            key={index}
            className={s.keyword}
            href={`?search=${encodeURIComponent(keyword)}`}
            onClick={(e) => {
              e.preventDefault()
              onSelectTag(keyword)
            }}
            title={`Search plugins tagged "${keyword}"`}
            data-cy="plugin-tag"
          >
            #{keyword}
          </a>
        ))}
      </div>
    </li>
  )
}

export default function PluginsList() {
  const [query, setQuery] = useState('')
  const [badgeFilter, setBadgeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const controlsRef = useRef(null)
  const searchRef = useRef(null)

  // Seed the search from a shareable `?search=` param on load. Done in an
  // effect (not the initial state) so server and client first render agree.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const initial = new URLSearchParams(window.location.search).get('search')
    if (initial) setQuery(initial)
  }, [])

  // Update the search and reflect it in the URL so the current filter is
  // linkable, without triggering a navigation.
  const applyQuery = (value) => {
    setQuery(value)
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (value) url.searchParams.set('search', value)
    else url.searchParams.delete('search')
    window.history.replaceState(null, '', url)
  }

  // Clicking a keyword tag filters the list by that tag and scrolls back to
  // the controls so the applied search is visible.
  const selectTag = (tag) => {
    applyQuery(tag)
    controlsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Merge metadata once and keep the curated category structure.
  const categories = useMemo(
    () =>
      pluginsJSON.plugins.map((category) => ({
        ...category,
        plugins: category.plugins.map(withMeta),
      })),
    []
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categories
      .filter(
        (category) =>
          categoryFilter === 'all' || category.name === categoryFilter
      )
      .map((category) => {
        const plugins = category.plugins.filter((plugin) => {
          if (badgeFilter !== 'all' && plugin.badge !== badgeFilter) {
            return false
          }
          if (!q) return true
          const haystack = [
            plugin.name,
            plugin.description,
            category.name,
            ...(plugin.keywords || []),
            plugin.meta?.npm,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
          return haystack.includes(q)
        })
        return { ...category, plugins }
      })
      .filter((category) => category.plugins.length > 0)
  }, [categories, query, badgeFilter, categoryFilter])

  const total = useMemo(
    () => filtered.reduce((sum, c) => sum + c.plugins.length, 0),
    [filtered]
  )

  return (
    <div className={s.root}>
      <div className={s.legend} aria-label="What the badges mean">
        {BADGE_ORDER.map((badge) => (
          <span key={badge} className={s.legendItem}>
            <Badge badge={badge} />
            <span className={s.legendText}>{BADGE_INFO[badge]}</span>
          </span>
        ))}
      </div>

      <div className={s.controls} ref={controlsRef}>
        <div className={s.searchWrap}>
          <input
            type="search"
            ref={searchRef}
            className={s.search}
            placeholder="Search plugins by name, keyword, or description…"
            value={query}
            onChange={(e) => applyQuery(e.target.value)}
            aria-label="Search plugins"
            data-cy="plugins-search"
          />
          {query && (
            <button
              type="button"
              className={s.clearBtn}
              aria-label="Clear search"
              data-cy="plugins-search-clear"
              onClick={() => {
                applyQuery('')
                searchRef.current?.focus()
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <select
          className={s.select}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          data-cy="plugins-category-filter"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className={s.select}
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          aria-label="Filter by trust level"
          data-cy="plugins-badge-filter"
        >
          <option value="all">All trust levels</option>
          {BADGE_ORDER.map((badge) => (
            <option key={badge} value={badge}>
              {badge[0].toUpperCase() + badge.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <p className={s.resultCount} data-cy="plugins-result-count">
        Showing {total} {total === 1 ? 'plugin' : 'plugins'}
      </p>

      {filtered.length === 0 ? (
        <p className={s.empty}>
          No plugins match your search. Try a different term or clear the
          filters.
        </p>
      ) : (
        filtered.map((category) => (
          <section key={category.name} data-cy={`plugin-${category.name}`}>
            <h2 id={category.name.replaceAll(' ', '-').toLowerCase()}>
              {category.name}
            </h2>

            {category.description && (
              <p
                className="mb-[16px]"
                dangerouslySetInnerHTML={createMarkup(category.description)}
              ></p>
            )}

            <ul className={clsx(s.pluginsList, '!pl-0')}>
              {category.plugins.map((plugin) => (
                <PluginCard
                  key={plugin.name}
                  plugin={plugin}
                  onSelectTag={selectTag}
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
