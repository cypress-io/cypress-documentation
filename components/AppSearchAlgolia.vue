<template>
  <div id="docsearch" class="w-full mx-8 lg:m-0 lg:w-1/5" />
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
    // @todo: do we need this?
    settings: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  watch: {
    options(newValue) {
      this.update(newValue)
    },
  },
  mounted() {
    this.initialize(this.options)
  },
  methods: {
    stripTrailingSlash(url) {
      return url.replace(/\/$|\/(?=\?)|\/(?=#)/g, '')
    },
    formatUrl(absoluteUrl) {
      const { pathname, hash } = new URL(absoluteUrl)
      const url = pathname.replace(this.settings.url, '/') + hash

      return this.stripTrailingSlash(url)
    },
    initialize(userOptions, code) {
      Promise.all([
        import(/* webpackChunkName: "docsearch" */ '@docsearch/js'),
        import(/* webpackChunkName: "docsearch" */ '@docsearch/css'),
      ]).then(([docsearch]) => {
        docsearch = docsearch.default
        const lang = undefined // todo

        const payload = Object.assign({}, userOptions, {
          container: '#docsearch',
          searchParameters: Object.assign(
            {},
            lang && {
              facetFilters: [
                `${userOptions.langAttribute || 'language'}:${lang.iso}`,
              ].concat(userOptions.facetFilters || []),
            }
          ),
          navigator: {
            navigate: ({ suggestionUrl }) => {
              window.location.assign(suggestionUrl)
            },
          },
          transformItems: (items) => {
            return items.map((item) => {
              return Object.assign({}, item, {
                /**
                 * Search terms where the query matches the h1 header on the page,
                 * e.g. the query "clearCookie" returns the link to the `clearCookie`
                 * API doc page, will include a hash for `#__nuxt` in the search result
                 * URL. This hash can be safely removed before displaying the results
                 * in the Algolia UI. Removing the hash from the Nuxt app itself causes
                 * other unintended side effects, so we will sanitize these results instead.
                 */
                url: this.formatUrl(item.url).replace('#__nuxt', ''),
              })
            })
          },
          hitComponent: ({ hit, children }) => {
            return {
              type: 'a',
              ref: undefined,
              constructor: undefined,
              key: undefined,
              props: {
                href: hit.url,
                children,
              },
            }
          },
        })

        docsearch(payload)
      })
    },
    update(options, lang) {
      this.$el.innerHTML =
        '<div id="docsearch" class="w-full mx-8 lg:m-0 lg:w-1/5"></div>'

      this.initialize(options, lang)
    },
  },
}
</script>

<style>
.DocSearch {
  --docsearch-primary-color: #1dbe89;
  --docsearch-highlight-color: var(--docsearch-primary-color);
  --docsearch-text-color: var(--color-gray-700);
  --docsearch-modal-background: var(--color-gray-100);
  --docsearch-searchbox-shadow: inset 0 0 0 1px var(--docsearch-muted-color);
  --docsearch-searchbox-background: var(--color-gray-200);
  --docsearch-searchbox-focus-background: var(--color-gray-200);
  --docsearch-hit-color: #000;
  --docsearch-hit-active-color: #fff;
  --docsearch-muted-color: var(--color-gray-500);
  --docsearch-logo-color: var(--docsearch-muted-color);
  --docsearch-container-background: rgba(153, 155, 165, 0.8);
}

.DocSearch-MagnifierLabel,
.DocSearch-Reset {
  color: var(--docsearch-muted-color) !important;
}

.DocSearch-Hit-source {
  color: #000 !important;
}

.DocSearch-Button {
  @apply inset-y-0 left-0 pl-3 flex justify-start items-center w-full pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm !important;

  &:active,
  &:focus,
  &:hover {
    box-shadow: inset 0 0 0 2px var(--color-gray-700) !important;
  }
}

.DocSearch-Button .DocSearch-Search-Icon {
  color: inherit !important;
}

.DocSearch-Hits mark {
  color: #fff !important;
  background-color: var(--docsearch-primary-color) !important;
}

/** 
 * Color of the search modal input field box
 *
 * .DocSearch-Form {
 *   box-shadow: inset 0 0 0 2px #0b2d41 !important;
 * }
 *
 *
 * .DocSearch-MagnifierLabel,
 * .DocSearch-Reset {
 *   color: #0b2d41 !important;
 * }
 */

.DocSearch-Button-Placeholder {
  @apply px-3 !important;
}

.DocSearch-Screen-Icon > svg {
  display: inline !important;
}

.DocSearch-Input {
  --tw-ring-shadow: none !important;
}

.dark-mode {
  & .DocSearch {
    --docsearch-text-color: var(--color-gray-300);
    --docsearch-container-background: rgba(9, 10, 17, 0.8);
    --docsearch-modal-background: var(--color-gray-900);
    --docsearch-modal-shadow: inset 1px 1px 0 0 #2c2e40, 0 3px 8px 0 #000309;
    --docsearch-searchbox-background: var(--color-gray-800);
    --docsearch-searchbox-focus-background: var(--color-gray-800);
    --docsearch-hit-color: var(--color-gray-300);
    --docsearch-hit-shadow: none;
    --docsearch-hit-background: var(--color-gray-800);
    --docsearch-key-gradient: linear-gradient(-26.5deg, #565872, #31355b);
    --docsearch-key-shadow: inset 0 -2px 0 0 #282d55, inset 0 0 1px 1px #51577d,
      0 2px 2px 0 rgba(3, 4, 9, 0.3);
    --docsearch-footer-background: var(--color-gray-800);
    --docsearch-footer-shadow: inset 0 1px 0 0 rgba(73, 76, 106, 0.5),
      0 -4px 8px 0 rgba(0, 0, 0, 0.2);
    --docsearch-logo-color: #fff;
    --docsearch-muted-color: var(--color-gray-500);
  }
}
</style>
