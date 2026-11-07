import conversionLinks from './fullstory-conversion-links'

const { SURFACES, conversionLinkAttributes, labelLinkDescendants } =
  conversionLinks

// Checked in order, so a doc sidebar inside the mobile navbar drawer counts as
// the sidebar rather than the navbar.
const SURFACE_SELECTORS = [
  ['.theme-doc-sidebar-container, .theme-doc-sidebar-menu', SURFACES.sidebar],
  ['.theme-announcement-bar', SURFACES.announcement],
  ['.navbar, .navbar-sidebar', SURFACES.navbar],
  ['.footer', SURFACES.footer],
  ['main', SURFACES.content],
]

function surfaceOf(link) {
  const match = SURFACE_SELECTORS.find(([selector]) => link.closest(selector))
  return match ? match[1] : null
}

function labelConversionLinks() {
  // A relative href resolves against the page it's on, as the browser would.
  const base = `https://docs.cypress.io${window.location.pathname}`
  document.querySelectorAll('a[href]').forEach((link) => {
    if (!link.hasAttribute('data-fs-element')) {
      const surface = surfaceOf(link)
      if (!surface) return
      const attributes = conversionLinkAttributes(
        link.getAttribute('href'),
        surface,
        base
      )
      Object.entries(attributes).forEach(([name, value]) => {
        link.setAttribute(name, value)
      })
    }
    labelLinkDescendants(link)
  })
}

// onRouteDidUpdate runs in a layout effect, before the browser paints the new
// page, so two frames leave room for anything that renders right after it.
export function onRouteDidUpdate() {
  requestAnimationFrame(() => requestAnimationFrame(labelConversionLinks))
}
