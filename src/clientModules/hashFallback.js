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
/** Pending retry timer, so a route change can cancel a scroll meant for the previous page. */
let retryTimer = null

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
  if (retryTimer) {
    window.clearTimeout(retryTimer)
  }
  resolveHash()
  window.requestAnimationFrame(resolveHash)
  retryTimer = window.setTimeout(retryRewrittenScroll, 250)
}

export function onRouteDidUpdate({ location }) {
  if (location?.hash) {
    scheduleResolve()
  } else if (retryTimer) {
    window.clearTimeout(retryTimer)
    retryTimer = null
    rewrittenId = null
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', scheduleResolve)
}
