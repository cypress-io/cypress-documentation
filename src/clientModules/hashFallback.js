import { matchCanonicalId } from './matchCanonicalId.js'

function collectIds() {
  const ids = []
  for (const el of document.querySelectorAll('[id]')) {
    if (el.id) {
      ids.push(el.id)
    }
  }
  return ids
}

/** Canonical id we rewrote to, so a delayed retry can scroll after hydration. */
let rewrittenId = null

/**
 * If the current hash does not match an id exactly, rewrite it to the
 * case-insensitive match (when there is one) and scroll that heading into view.
 * Exact matches are left alone so Docusaurus can handle scrolling.
 */
function resolveHash() {
  const { hash, pathname, search } = window.location
  if (!hash) {
    return
  }

  const match = matchCanonicalId(hash, collectIds())
  if (!match?.rewrite) {
    return
  }

  const el = document.getElementById(match.id)
  if (!el) {
    return
  }

  window.history.replaceState(
    window.history.state,
    '',
    `${pathname}${search}#${match.id}`
  )
  rewrittenId = match.id
  el.scrollIntoView()
}

function retryRewrittenScroll() {
  if (!rewrittenId) {
    return
  }
  const el = document.getElementById(rewrittenId)
  rewrittenId = null
  el?.scrollIntoView()
}

function scheduleResolve() {
  resolveHash()
  window.requestAnimationFrame(resolveHash)
  window.setTimeout(retryRewrittenScroll, 250)
}

export function onRouteDidUpdate({ location }) {
  if (location?.hash) {
    scheduleResolve()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', scheduleResolve)
}
