/**
 * This code is taken from the default `scrollBehavior`.
 * @see
 * https://github.com/nuxt/nuxt.js/blob/0a98866894f018019d26926f1846396c4be71c0d/packages/vue-app/template/router.scrollBehavior.js#L1-L82
 */
function getMatchedComponents(route, matches = false, prop = 'components') {
  return Array.prototype.concat.apply(
    [],
    route.matched.map((m, index) => {
      return Object.keys(m[prop]).map((key) => {
        matches && matches.push(index)

        return m[prop][key]
      })
    })
  )
}

function setScrollRestoration(newVal) {
  try {
    window.history.scrollRestoration = newVal
  } catch (e) {
    // do nothing
  }
}

if (process.client) {
  if ('scrollRestoration' in window.history) {
    setScrollRestoration('manual')

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      setScrollRestoration('auto')
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      setScrollRestoration('manual')
    })
  }
}

/**
 * Required for the default `scrollToTop` behavior
 * @see
 * https://nuxtjs.org/docs/2.x/components-glossary/pages-scrolltotop/
 */
function shouldScrollToTop(route) {
  const Pages = getMatchedComponents(route)

  if (Pages.length === 1) {
    const { options = {} } = Pages[0]

    return options.scrollToTop !== false
  }

  return Pages.some(({ options }) => options && options.scrollToTop)
}

/* eslint-disable no-console */
export default function scrollBehavior(to, from, savedPosition) {
  window.console.log('to: ', to)
  window.console.log('from: ', from)
  window.console.log('savedPosition: ', savedPosition)
  // If the returned position is falsy or an empty object, will retain current scroll position
  let position = false
  const isRouteChanged = to !== from

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
    window.scrollTo(savedPosition.x, savedPosition.y)
  } else if (isRouteChanged && shouldScrollToTop(to)) {
    window.console.log('route changed and should scrollToTop, pos = {x:0,y:0}')
    position = { x: 0, y: 0 }
  }

  const nuxt = window.$nuxt

  if (
    // Initial load (vuejs/vue-router#3199)
    !isRouteChanged ||
    // Route hash changes
    (to.path === from.path && to.hash !== from.hash)
  ) {
    nuxt.$nextTick(() => nuxt.$emit('triggerScroll'))
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash

        // CSS.escape() is not supported with IE and Edge.
        if (
          typeof window.CSS !== 'undefined' &&
          typeof window.CSS.escape !== 'undefined'
        ) {
          hash = `#${window.CSS.escape(hash.substr(1))}`
        }

        try {
          const ele = document.querySelector(hash)

          if (ele) {
            // scroll to anchor by returning the selector
            position = { selector: to.hash, offset: { y: 80 } }
            window.console.log('scrollBehavior - position: ', position)
          }
        } catch (e) {
          console.warn(
            'Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).'
          )
        }
        window.console.log('resolving position: ', position)
        resolve(position)
      }
    })
  })
}
/* eslint-enable no-console */
