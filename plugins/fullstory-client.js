import sectionTitles from '@site/src/sectionTitles'

const { DEFAULT_SECTION_NAME, SECTION_NAME, productForUrl, titleSuffixForUrl } =
  sectionTitles

function pageProperties(pathname) {
  const section = pathname.replace(/^\//, '').split('/')[0]
  const suffix = ` | ${titleSuffixForUrl(pathname)}`
  const title = document.title
  const docTitle = title.endsWith(suffix)
    ? title.slice(0, -suffix.length)
    : title
  // The section prefix keeps pages that share a title, in different
  // sections, apart as separate Fullstory Pages.
  const sectionName = SECTION_NAME[section] || DEFAULT_SECTION_NAME
  const product = productForUrl(pathname)
  return {
    pageName: `${sectionName}: ${docTitle}`,
    section: section || '(none)',
    docTitle,
    // www.cypress.io sends the same two properties, so one funnel can follow a
    // reader across both sites and into Cypress Cloud.
    pageType: 'docs',
    ...(product && { product }),
  }
}

// onRouteDidUpdate runs in a layout effect, before react-helmet-async writes
// the new <title> in a requestAnimationFrame of its own, so reading it straight
// away gives the previous page's title. Helmet cancels and re-requests that
// frame whenever the head changes again, and the second frame leaves room for
// a change that lands after this one was requested.
function afterTitleUpdate(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}

export function onRouteDidUpdate({ location, previousLocation }) {
  if (typeof window.FS !== 'function') return
  if (previousLocation && previousLocation.pathname === location.pathname) {
    return
  }
  afterTitleUpdate(() => {
    // A second navigation before the frames ran sends its own properties.
    if (window.location.pathname !== location.pathname) return
    if (typeof window.FS !== 'function') return
    window.FS('setProperties', {
      type: 'page',
      properties: pageProperties(location.pathname),
    })
  })
}
