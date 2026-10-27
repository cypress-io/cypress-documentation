import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faExclamationTriangle,
  faSearch,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import s from './style.module.css'
// @ts-ignore
import pluginsJSON from '@site/src/data/plugins.json'
// @ts-ignore
import generatedJSON from '@site/src/data/plugins-generated.json'
import clsx from 'clsx'

/** Metadata generated from npm by `scripts/enrich-plugins.mjs`. */
type PluginMeta = {
  npm?: string
  version?: string
  lastPublished?: string
  cypressVersion?: string
  deprecated?: boolean
  deprecatedReason?: string
}

/** A curated entry from `src/data/plugins.json`. */
type PluginEntry = {
  name: string
  description: string
  link: string
  keywords?: string[]
  badge?: string
  npm?: string
}

/** A curated entry merged with its generated metadata. */
type Plugin = PluginEntry & {
  meta: PluginMeta
  /** Who maintains it, from the curated badge. */
  maintainer: Maintainer
  deprecated: boolean
  author: string | null
}

type Maintainer = 'official' | 'community'

/** A step in a test suite's life, used to group and order the categories. */
type Stage = { id: string; name: string }

type CategoryEntry = {
  name: string
  /** Shorter label for the category list, when `name` is long. */
  shortName?: string
  /** Id of a stage in `plugins.json` → `stages`. */
  stage?: string
  description?: string
  plugins: PluginEntry[]
}

type Category = {
  id: string
  name: string
  shortName: string
  description?: string
  stage: Stage
  plugins: Plugin[]
}

type SortKey = 'recommended' | 'updated' | 'name'

/** Description HTML from plugins.json: links that open a new tab get the
 * same screen-reader note as the card's own links. */
function createDescriptionMarkup(html: string) {
  return {
    __html: html.replace(
      /(<a\b[^>]*target=["']_blank["'][^>]*>)([\s\S]*?)(<\/a>)/g,
      `$1$2<span class="${s.srOnly}"> (opens in a new tab)</span>$3`
    ),
  }
}

/** Screen-reader text for a link that opens a new tab, so it doesn't change
 * context without warning. */
function NewTabNote() {
  return <span className={s.srOnly}> (opens in a new tab)</span>
}

/** Docs pages open in the same tab; only off-site links open a new one. */
function isExternal(href: string) {
  return /^https?:\/\//.test(href)
}

/** Category anchors stay `name` with hyphens, lowercased, so existing links
 * such as `#custom-commands` keep working. */
function categoryId(name: string) {
  return name.replaceAll(' ', '-').toLowerCase()
}

const GENERATED: Record<string, PluginMeta> =
  (generatedJSON && generatedJSON.plugins) || {}

const STAGES: Stage[] = pluginsJSON.stages || []
/** Categories without a known stage still show, after the others. */
const OTHER_STAGE: Stage = { id: 'other', name: 'More plugins' }

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function parseDate(iso?: string) {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

function monthsSince(date: Date) {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
}

/** "this month", "3 months ago", "2 years ago". */
function timeAgo(months: number) {
  if (months < 1) return 'this month'
  if (months < 12) {
    const m = Math.floor(months)
    return m === 1 ? '1 month ago' : `${m} months ago`
  }
  const y = Math.floor(months / 12)
  return y === 1 ? '1 year ago' : `${y} years ago`
}

/** The distinctive part of a name: no npm scope, no leading `cypress-`. */
function keyName(name: string) {
  return name.replace(/^@[^/]+\//, '').replace(/^cypress[-\s]?/i, '') || name
}

/** Two letters for the card's tile: initials of a multi-word name, or the
 * first two letters of a single word. */
function monogram(name: string) {
  const parts = keyName(name)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
  if (!parts.length) return 'Cy'
  if (parts.length === 1) {
    return parts[0][0].toUpperCase() + (parts[0][1] || '').toLowerCase()
  }
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

/** Best guess at who publishes a community plugin: the repository owner, the
 * npm scope, or the vendor's domain. */
function authorOf(entry: PluginEntry, meta: PluginMeta) {
  try {
    const url = new URL(entry.link, 'https://docs.cypress.io')
    if (/(^|\.)(github\.com|gitlab\.com|bitbucket\.org)$/.test(url.hostname)) {
      const owner = url.pathname.split('/').filter(Boolean)[0]
      if (owner) return owner
    }
    const npm = meta.npm || entry.npm
    if (npm && npm.startsWith('@')) return npm.slice(1).split('/')[0]
    // Listing pages name the store, not the author.
    if (
      /(^|\.)(cypress\.io|visualstudio\.com|google\.com|npmjs\.com)$/.test(
        url.hostname
      )
    ) {
      return null
    }
    return url.hostname.replace(/^(www|docs|support)\./, '')
  } catch {
    return null
  }
}

/** False during SSR and the first client render, true afterwards. Lets us defer
 *  `Date.now()`-dependent output so server and client markup always match. */
function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

/** Merge a plugin's curated entry with its generated metadata. */
function withMeta(entry: PluginEntry): Plugin {
  const meta = GENERATED[entry.name] || {}
  return {
    ...entry,
    meta,
    maintainer: entry.badge === 'official' ? 'official' : 'community',
    deprecated: !!meta.deprecated,
    author: entry.badge === 'official' ? null : authorOf(entry, meta),
  }
}

function publishedTime(p: Plugin) {
  const d = parseDate(p.meta.lastPublished)
  return d ? d.getTime() : -Infinity
}

function byName(a: Plugin, b: Plugin) {
  return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
}

/** Built by Cypress first and deprecated last, then the most recently
 *  published, with an alphabetical fallback. */
function byRecommended(a: Plugin, b: Plugin) {
  const tier = (p: Plugin) =>
    p.deprecated ? 2 : p.maintainer === 'official' ? 0 : 1
  return (
    tier(a) - tier(b) || publishedTime(b) - publishedTime(a) || byName(a, b)
  )
}

function byUpdated(a: Plugin, b: Plugin) {
  return publishedTime(b) - publishedTime(a) || byName(a, b)
}

const COMPARE: Record<SortKey, (a: Plugin, b: Plugin) => number> = {
  recommended: byRecommended,
  updated: byUpdated,
  name: byName,
}

function searchText(p: Plugin, category: Category) {
  return [
    p.name,
    p.description.replace(/<[^>]+>/g, ' '),
    category.name,
    ...(p.keywords || []),
    p.meta.npm,
    p.author,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function SealIcon() {
  return (
    <svg
      className={s.sealIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.3 1.7 2.9-.2.9 2.7 2.4 1.6-.9 2.7.9 2.7-2.4 1.6-.9 2.7-2.9-.2L12 21.5l-2.3-1.7-2.9.2-.9-2.7-2.4-1.6.9-2.7-.9-2.7 2.4-1.6.9-2.7 2.9.2z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  )
}

/** Last publish as a colored dot plus text. The age bucket depends on the
 *  current date, so it's only applied after mount to keep hydration stable. */
function Freshness({ meta }: { meta: PluginMeta }) {
  const mounted = useMounted()
  const published = parseDate(meta.lastPublished)

  if (!published) {
    return (
      <span className={s.freshness}>
        <span className={clsx(s.dot, s.dotNone)} aria-hidden="true" />
        Not on npm
      </span>
    )
  }

  const months = mounted ? monthsSince(published) : null
  const bucket =
    months === null
      ? null
      : months <= 6
        ? s.dotActive
        : months <= 18
          ? s.dotRecent
          : s.dotStale
  const stale = months !== null && months > 18

  return (
    <>
      <span
        className={s.freshness}
        title={`Last published to npm on ${fullDateFormatter.format(published)}`}
      >
        <span
          className={clsx(s.dot, bucket || s.dotPending)}
          aria-hidden="true"
        />
        Updated{' '}
        {months === null
          ? monthYearFormatter.format(published)
          : timeAgo(months)}
      </span>
      {stale && <span className={s.staleNote}>May be unmaintained</span>}
    </>
  )
}

function PluginCard({ plugin, stageId }: { plugin: Plugin; stageId: string }) {
  const { meta } = plugin
  const external = isExternal(plugin.link)
  const npmUrl = meta.npm ? `https://www.npmjs.com/package/${meta.npm}` : null

  return (
    <li
      className={s.card}
      data-cy={`plugin-${plugin.name}`}
      data-maintainer={plugin.maintainer}
      data-deprecated={plugin.deprecated ? 'true' : undefined}
      data-published={meta.lastPublished || undefined}
    >
      <div className={s.cardHead}>
        <span
          className={s.monogram}
          data-stage={stageId}
          aria-hidden="true"
          data-sanitize=""
        >
          {monogram(plugin.name)}
        </span>
        <div className={s.cardHeading}>
          <h3 className={s.cardTitle}>
            <a
              className={s.cardLink}
              href={plugin.link}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {plugin.name}
              {external && <NewTabNote />}
            </a>
          </h3>
          {plugin.maintainer === 'official' ? (
            <span className={s.byOfficial} data-cy="plugin-maintainer">
              <SealIcon />
              Built by Cypress
            </span>
          ) : (
            <span className={s.byCommunity} data-cy="plugin-maintainer">
              Community{plugin.author ? ` · ${plugin.author}` : ''}
            </span>
          )}
        </div>
      </div>

      <p
        className={s.cardDescription}
        dangerouslySetInnerHTML={createDescriptionMarkup(plugin.description)}
      />

      {plugin.deprecated && (
        <p className={s.deprecatedNotice}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={s.noticeIcon}
          />
          {meta.deprecatedReason || 'This plugin is no longer maintained.'}
        </p>
      )}

      <div className={s.cardFooter}>
        <Freshness meta={meta} />
        {/* Flex layout ignores these spaces; text exports keep them. */}{' '}
        {meta.version && (
          <span className={s.version}>
            <span aria-hidden="true">·</span> v{meta.version}
          </span>
        )}
      </div>

      {(meta.cypressVersion || npmUrl) && (
        <div className={s.cardMore}>
          <span
            className={s.range}
            data-cy="plugin-cypress-range"
            title={
              meta.cypressVersion
                ? `Declares cypress ${meta.cypressVersion}`
                : undefined
            }
          >
            {meta.cypressVersion
              ? `Cypress ${meta.cypressVersion}`
              : 'No Cypress range declared'}
          </span>{' '}
          {npmUrl && (
            <a
              className={s.npmLink}
              href={npmUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              npm
              <span className={s.srOnly}>
                {' '}
                package {meta.npm}
                {meta.version ? ` ${meta.version}` : ''} (opens in a new tab)
              </span>
            </a>
          )}
        </div>
      )}
    </li>
  )
}

export default function PluginsList() {
  const [query, setQuery] = useState('')
  const [maintainer, setMaintainer] = useState<'all' | Maintainer>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sort, setSort] = useState<SortKey>('recommended')
  const resultsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  // Flips to true once mounted, so tests can wait for hydration before the
  // controls are interactive.
  const hydrated = useMounted()

  // Seed the search from a shareable `?search=` param on load. Done in an
  // effect (not the initial state) so server and client first render agree.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const initial = new URLSearchParams(window.location.search).get('search')
    if (initial) setQuery(initial)
  }, [])

  // Update the search and reflect it in the URL so the current filter is
  // linkable, without triggering a navigation.
  const applyQuery = (value: string) => {
    setQuery(value)
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (value) url.searchParams.set('search', value)
    else url.searchParams.delete('search')
    window.history.replaceState(null, '', url)
  }

  // Picking a category shows only that section; bring its top into view when
  // the results start above the viewport.
  const pickCategory = (id: string) => {
    setCategoryFilter(id)
    const top = resultsRef.current?.getBoundingClientRect().top
    if (top !== undefined && top < 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Merge metadata and order the categories along the path of a test suite:
  // by stage, then alphabetically within each stage.
  const categories: Category[] = useMemo(() => {
    const stageOrder = new Map(STAGES.map((stage, i) => [stage.id, i]))
    return (pluginsJSON.plugins as CategoryEntry[])
      .map((entry) => ({
        id: categoryId(entry.name),
        name: entry.name,
        shortName: entry.shortName || entry.name,
        description: entry.description,
        stage: STAGES.find((st) => st.id === entry.stage) || OTHER_STAGE,
        plugins: entry.plugins.map(withMeta),
      }))
      .sort(
        (a, b) =>
          (stageOrder.get(a.stage.id) ?? STAGES.length) -
            (stageOrder.get(b.stage.id) ?? STAGES.length) ||
          a.name.localeCompare(b.name)
      )
  }, [])

  // Plugins that match the search and maintainer filter, per category. The
  // category dropdown counts from these, so the counts track the other filters.
  const matching = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categories.map((category) => ({
      ...category,
      plugins: category.plugins.filter(
        (p) =>
          (maintainer === 'all' || p.maintainer === maintainer) &&
          (!q || searchText(p, category).includes(q))
      ),
    }))
  }, [categories, query, maintainer])

  const sections = useMemo(
    () =>
      matching
        .filter(
          (category) =>
            categoryFilter === 'all' || category.id === categoryFilter
        )
        .map((category) => ({
          ...category,
          plugins: [...category.plugins].sort(COMPARE[sort]),
        }))
        .filter((category) => category.plugins.length > 0),
    [matching, categoryFilter, sort]
  )

  // The category dropdown groups its options by stage.
  const categoryGroups = useMemo(() => {
    const groups: { stage: Stage; categories: typeof matching }[] = []
    for (const category of matching) {
      const last = groups[groups.length - 1]
      if (last && last.stage.id === category.stage.id) {
        last.categories.push(category)
      } else {
        groups.push({ stage: category.stage, categories: [category] })
      }
    }
    return groups
  }, [matching])

  const matchingTotal = matching.reduce((n, c) => n + c.plugins.length, 0)
  const total = sections.reduce((n, c) => n + c.plugins.length, 0)
  const selected = categories.find((c) => c.id === categoryFilter)
  const hasFilters = !!(
    query ||
    maintainer !== 'all' ||
    categoryFilter !== 'all'
  )

  const clearAll = () => {
    applyQuery('')
    setMaintainer('all')
    setCategoryFilter('all')
  }

  return (
    <div
      className={s.root}
      data-cy="plugins-list"
      data-hydrated={hydrated ? 'true' : 'false'}
    >
      <div className={s.toolbar} data-sanitize="">
        <div className={clsx(s.field, s.searchField)}>
          <label htmlFor="plugins-search" className={s.fieldLabel}>
            Search
          </label>
          <div className={s.searchWrap}>
            <FontAwesomeIcon
              icon={faSearch}
              className={s.searchIcon}
              aria-hidden="true"
            />
            <input
              id="plugins-search"
              type="search"
              ref={searchRef}
              className={s.search}
              placeholder="Name, package, or keyword"
              value={query}
              onChange={(e) => applyQuery(e.target.value)}
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
        </div>
        <div className={clsx(s.field, s.categoryField)}>
          <label htmlFor="plugins-category" className={s.fieldLabel}>
            Category
          </label>
          <select
            id="plugins-category"
            className={s.select}
            value={categoryFilter}
            onChange={(e) => pickCategory(e.target.value)}
            data-cy="plugins-category-filter"
          >
            <option value="all">All categories ({matchingTotal})</option>
            {categoryGroups.map(({ stage, categories: group }) => (
              <optgroup key={stage.id} label={stage.name}>
                {group.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.shortName} ({category.plugins.length})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className={s.field}>
          <label htmlFor="plugins-maintainer" className={s.fieldLabel}>
            Maintained by
          </label>
          <select
            id="plugins-maintainer"
            className={s.select}
            value={maintainer}
            onChange={(e) =>
              setMaintainer(e.target.value as 'all' | Maintainer)
            }
            data-cy="plugins-maintainer-filter"
          >
            <option value="all">All</option>
            <option value="official">Cypress</option>
            <option value="community">Community</option>
          </select>
        </div>
        <div className={s.field}>
          <label htmlFor="plugins-sort" className={s.fieldLabel}>
            Sort by
          </label>
          <select
            id="plugins-sort"
            className={s.select}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            data-cy="plugins-sort"
          >
            <option value="recommended">Recommended</option>
            <option value="updated">Recently updated</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      <div className={s.results} ref={resultsRef}>
        <div className={s.resultsHeader} data-sanitize="">
          <p
            className={s.resultCount}
            data-cy="plugins-result-count"
            aria-live="polite"
          >
            Showing {total} {total === 1 ? 'plugin' : 'plugins'}
            {selected ? ` in ${selected.name}` : ''}
          </p>
          {hasFilters && (
            <button
              type="button"
              className={s.clearFilters}
              onClick={clearAll}
              data-cy="plugins-clear-filters"
            >
              Clear filters
            </button>
          )}
        </div>

        {sections.length === 0 ? (
          <div className={s.empty}>
            <p className={s.emptyTitle}>
              No plugins match your search or filters
            </p>
            <p>Try a shorter search, or clear the filters to see them all.</p>
            <button type="button" className={s.clearFilters} onClick={clearAll}>
              Clear filters
            </button>
          </div>
        ) : (
          sections.map((category) => (
            <section
              key={category.id}
              className={s.section}
              data-stage={category.stage.id}
              data-cy="plugins-category"
              data-category={category.id}
              aria-labelledby={category.id}
            >
              <div className={s.sectionHeader}>
                <p className={s.eyebrow} data-cy="plugins-category-stage">
                  {category.stage.name}
                </p>
                <h2 id={category.id} className={s.sectionTitle}>
                  {category.name}
                </h2>
                {category.description && (
                  <p
                    className={s.sectionDescription}
                    dangerouslySetInnerHTML={createDescriptionMarkup(
                      category.description
                    )}
                  />
                )}
              </div>
              <ul className={s.grid}>
                {category.plugins.map((plugin) => (
                  <PluginCard
                    key={plugin.name}
                    plugin={plugin}
                    stageId={category.stage.id}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
