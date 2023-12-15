import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useDocSearchKeyboardEvents } from '@docsearch/react'
import Head from '@docusaurus/Head'
import Link from '@docusaurus/Link'
import { useHistory } from '@docusaurus/router'
import {
  isRegexpStringMatch,
  useSearchLinkCreator,
} from '@docusaurus/theme-common'
import {
  useAlgoliaContextualFacetFilters,
  useSearchResultUrlProcessor,
} from '@docusaurus/theme-search-algolia/client'
import Translate from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { createPortal } from 'react-dom'
import translations from '@theme/SearchTranslations'
import { IconObjectMagnifyingGlass } from '@cypress-design/react-icon'
let DocSearchModal = null
function Hit({ hit, children }) {
  return <Link to={hit.url}>{children}</Link>
}
function ResultsFooter({ state, onClose }) {
  const createSearchLink = useSearchLinkCreator()
  return (
    <Link to={createSearchLink(state.query)} onClick={onClose}>
      <Translate
        id="theme.SearchBar.seeAll"
        values={{ count: state.context.nbHits }}
      >
        {'See all {count} results'}
      </Translate>
    </Link>
  )
}
function mergeFacetFilters(f1, f2) {
  const normalize = (f) => (typeof f === 'string' ? [f] : f)
  return [...normalize(f1), ...normalize(f2)]
}
function DocSearch({ contextualSearch, externalUrlRegex, ...props }) {
  const { siteMetadata } = useDocusaurusContext()
  const processSearchResultUrl = useSearchResultUrlProcessor()
  const contextualSearchFacetFilters = useAlgoliaContextualFacetFilters()
  const configFacetFilters = props.searchParameters?.facetFilters ?? []
  const facetFilters = contextualSearch
    ? // Merge contextual search filters with config filters
      mergeFacetFilters(contextualSearchFacetFilters, configFacetFilters)
    : // ... or use config facetFilters
      configFacetFilters
  // We let user override default searchParameters if she wants to
  const searchParameters = {
    ...props.searchParameters,
    facetFilters,
  }
  const history = useHistory()
  const searchContainer = useRef(null)
  const searchButtonRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState(undefined)
  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve()
    }
    return Promise.all([
      import('@docsearch/react/modal'),
      import('@docsearch/react/style'),
      import('./styles.css'),
    ]).then(([{ DocSearchModal: Modal }]) => {
      DocSearchModal = Modal
    })
  }, [])
  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      searchContainer.current = document.createElement('div')
      document.body.insertBefore(
        searchContainer.current,
        document.body.firstChild
      )
      setIsOpen(true)
    })
  }, [importDocSearchModalIfNeeded, setIsOpen])
  const onClose = useCallback(() => {
    setIsOpen(false)
    searchContainer.current?.remove()
  }, [setIsOpen])
  const onInput = useCallback(
    (event) => {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true)
        setInitialQuery(event.key)
      })
    },
    [importDocSearchModalIfNeeded, setIsOpen, setInitialQuery]
  )
  const navigator = useRef({
    navigate({ itemUrl }) {
      // Algolia results could contain URL's from other domains which cannot
      // be served through history and should navigate with window.location
      if (isRegexpStringMatch(externalUrlRegex, itemUrl)) {
        window.location.href = itemUrl
      } else {
        history.push(itemUrl)
      }
    },
  }).current
  const transformItems = useRef((items) =>
    props.transformItems
      ? // Custom transformItems
        props.transformItems(items)
      : // Default transformItems
        items.map((item) => ({
          ...item,
          url: processSearchResultUrl(item.url),
        }))
  ).current
  const resultsFooterComponent = useMemo(
    () =>
      // eslint-disable-next-line react/no-unstable-nested-components
      (footerProps) =>
        <ResultsFooter {...footerProps} onClose={onClose} />,
    [onClose]
  )
  const transformSearchClient = useCallback(
    (searchClient) => {
      searchClient.addAlgoliaAgent('docusaurus', siteMetadata.docusaurusVersion)
      return searchClient
    },
    [siteMetadata.docusaurusVersion]
  )
  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })
  return (
    <>
      <Head>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          rel="preconnect"
          href={`https://${props.appId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
      </Head>

      <button
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={onOpen}
        ref={searchButtonRef}
        className="mx-[16px] gap-[16px] w-[180px]  text-gray-400 dark:text-gray-600 rounded-full px-[16px] h-[38px] border border-gray-50 dark:border-gray-900 flex items-center"
      >
        <IconObjectMagnifyingGlass fillColor="transparent" />
        Search ⌘K
      </button>

      {isOpen &&
        DocSearchModal &&
        searchContainer.current &&
        createPortal(
          <DocSearchModal
            onClose={onClose}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            transformSearchClient={transformSearchClient}
            {...(props.searchPagePath && {
              resultsFooterComponent,
            })}
            {...props}
            searchParameters={searchParameters}
            placeholder={translations.placeholder}
            translations={translations.modal}
          />,
          searchContainer.current
        )}
    </>
  )
}
export default function SearchBar() {
  const { siteConfig } = useDocusaurusContext()
  return <DocSearch {...siteConfig.themeConfig.algolia} />
}
