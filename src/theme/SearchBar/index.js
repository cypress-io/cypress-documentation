import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
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

/**
 * Initialize search-insights library with credentials.
 * The insights={true} prop loads the library but may not initialize it with credentials.
 * This ensures credentials are set so click events can be sent.
 */
async function initializeInsights(appId, apiKey) {
  if (typeof window === 'undefined') return false
  
  try {
    // Wait for the library to be loaded (insights prop loads it asynchronously)
    let attempts = 0
    while (attempts < 20 && (!window.aa || typeof window.aa !== 'function')) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }
    
    if (!window.aa || typeof window.aa !== 'function') {
      return false
    }
    
    // Initialize with credentials (idempotent - safe to call multiple times)
    window.aa('init', {
      appId,
      apiKey,
      useCookie: true,
    })
    
    return true
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Algolia Analytics] Failed to initialize insights:', e)
    }
    return false
  }
}

function Hit({ hit, children, appId, apiKey }) {
  const handleClick = useCallback(async () => {
    if (!hit.objectID || !appId || !apiKey) return
    
    // Ensure insights is initialized before sending events
    await initializeInsights(appId, apiKey)
    
    // Get queryID from hit (attached via transformItems)
    const queryID = hit.queryID || hit.__autocomplete_queryID
    if (!queryID) return // No queryID means clickAnalytics isn't working
    
    try {
      // Send click event to Algolia Insights
      window.aa('clickedObjectIDsAfterSearch', {
        eventName: 'Result Clicked',
        index: hit.__autocomplete_indexName || hit.index || 'cypress_docs',
        objectIDs: [hit.objectID],
        positions: [hit.__position || hit.__autocomplete_id || hit.position || 1],
        queryID: queryID,
      })
    } catch (error) {
      // Silently fail - don't break search functionality
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Algolia Analytics] Failed to send click event:', error)
      }
    }
  }, [hit, appId, apiKey])

  return (
    <Link to={hit.url} onClick={handleClick}>
      {children}
    </Link>
  )
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
    clickAnalytics: true,
  }

  // Initialize search-insights when component mounts
  useEffect(() => {
    if (props.appId && props.apiKey) {
      initializeInsights(props.appId, props.apiKey)
    }
  }, [props.appId, props.apiKey])
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
  // Store the latest queryID from search responses
  const queryIDRef = useRef(null)
  
  const transformItems = useRef((items) => {
    const transformedItems = props.transformItems
      ? // Custom transformItems
        props.transformItems(items)
      : // Default transformItems
        items.map((item) => ({
          ...item,
          url: processSearchResultUrl(item.url),
          // Attach queryID to each hit for click tracking (if available)
          queryID: queryIDRef.current || item.queryID,
        }))
    
    return transformedItems
  }).current
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
      
      // Capture queryID from search responses for click tracking
      const originalSearch = searchClient.search.bind(searchClient)
      searchClient.search = function (requests) {
        return originalSearch(requests).then((response) => {
          if (response.results?.[0]?.queryID) {
            queryIDRef.current = response.results[0].queryID
          }
          return response
        })
      }
      
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
        className="gap-[16px] sm:w-[180px] bg-white dark:bg-gray-1000 text-gray-400 dark:text-gray-600 rounded-full p-[12px] sm:px-[16px] sm:h-[38px] border border-gray-100 dark:border-gray-900 flex items-center xl:mx-[16px]"
      >
        <IconObjectMagnifyingGlass fillColor="transparent" />
        <span className="hidden sm:inline">Search ⌘K</span>
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
            hitComponent={(hitProps) => (
              <Hit {...hitProps} appId={props.appId} apiKey={props.apiKey} />
            )}
            transformSearchClient={transformSearchClient}
            {...(props.searchPagePath && {
              resultsFooterComponent,
            })}
            {...props}
            searchParameters={searchParameters}
            placeholder={translations.placeholder}
            translations={translations.modal}
            insights={true}
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
