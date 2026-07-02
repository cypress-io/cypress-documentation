import React, { useMemo, useState } from 'react'
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

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Deterministic "Mon YYYY" so server and client render identically. */
function formatMonthYear(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
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
  if (!meta) return null
  const updated = formatMonthYear(meta.lastPublished)
  const age = monthsSince(meta.lastPublished)
  const stale = typeof age === 'number' && age > 18
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
        📦 {meta.npm}
        {meta.version ? `@${meta.version}` : ''}
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
        🕒 Updated {updated}
      </span>
    )
  }
  if (meta.cypressVersion) {
    items.push(
      <span key="cy" className={s.signal} title="Supported Cypress versions">
        ⚙️ Cypress {meta.cypressVersion}
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
        ⬇️ {downloads}/wk
      </span>
    )
  }
  if (typeof meta.stars === 'number') {
    items.push(
      <span key="stars" className={s.signal} title="GitHub stars">
        ⭐ {meta.stars.toLocaleString('en-US')}
      </span>
    )
  }
  if (!items.length) return null
  return <div className={s.signals}>{items}</div>
}

function PluginCard({ plugin }) {
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
          ⚠️ {meta.deprecatedReason || 'This plugin is no longer maintained.'}
        </p>
      )}

      <TrustSignals meta={meta} />

      <div className={s.keywords}>
        {plugin.keywords?.map((keyword, index) => (
          <span key={index} className={s.keyword}>
            {' '}
            #{keyword}
          </span>
        ))}
      </div>
    </li>
  )
}

export default function PluginsList() {
  const [query, setQuery] = useState('')
  const [badgeFilter, setBadgeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

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

      <div className={s.controls}>
        <input
          type="search"
          className={s.search}
          placeholder="Search plugins by name, keyword, or description…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search plugins"
          data-cy="plugins-search"
        />
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
                <PluginCard key={plugin.name} plugin={plugin} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
