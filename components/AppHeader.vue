<script>
import AppHeaderMobileSection from './AppHeaderMobileSection.vue'
import AppSearchAlgolia from './AppSearchAlgolia'
import Banner from './Banner.vue'

export default {
  components: {
    AppSearchAlgolia,
    Banner,
    AppHeaderMobileSection,
  },
  props: {
    mobileMenuItems: {
      type: Array,
      required: false,
      default: () => [],
    },
    section: {
      type: String,
      required: false,
      default: undefined,
    },
    algoliaSettings: {
      type: Object,
      required: true,
    },
    banner: {
      type: Object,
      required: false,
      default: undefined,
    },
  },
  data: () => {
    return {
      navLink: [
        {
          label: 'Guides',
          path: '/guides/overview/why-cypress',
        },
        {
          label: 'API',
          path: '/api/table-of-contents',
        },
        {
          label: 'Plugins',
          path: '/plugins',
        },
        {
          label: 'Examples',
          path: '/examples/examples/recipes',
        },
        {
          label: 'FAQ',
          path: '/faq/questions/using-cypress-faq',
        },
      ],
      isMenuOpen: false,
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    isActive(path) {
      // eslint-disable-next-line no-unused-vars
      const [_empty, section, ..._rest] = path.split('/')

      return section === this.section
    },
  },
}
</script>

<template>
  <div>
    <nav
      :class="isMenuOpen ? 'h-full' : ''"
      class="w-full bg-gray-800 fixed top-0 left-0 overflow-y-auto z-20"
    >
      <Banner v-if="Boolean(banner)" :banner="banner"></Banner>
      <div class="mx-auto px-2 sm:px-4 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="flex items-center px-2 lg:px-0">
            <div class="flex-shrink-0">
              <a href="/">
                <img
                  class="block h-8 w-auto"
                  :src="require('~/assets/cypress-logo.png')"
                  alt="Cypress Docs Logo"
                />
              </a>
            </div>
            <div class="hidden lg:block lg:ml-6">
              <div class="flex space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <nuxt-link
                  v-for="(link, index) in navLink"
                  :key="`header-nav-link-${index}`"
                  :to="link.path"
                  :class="
                    isActive(link.path)
                      ? 'bg-gray-700 text-white'
                      : 'hover:bg-gray-700 hover:text-white text-gray-300'
                  "
                  class="px-3 py-2 rounded-md text-md font-bold"
                >
                  {{ link.label }}
                </nuxt-link>
                <a
                  href="https://learn.cypress.io"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-bold"
                >
                  <span class="sr-only">Learn</span>
                  Learn
                </a>
                <a
                  href="https://github.com/cypress-io/cypress"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-bold"
                >
                  <span class="sr-only">GitHub</span>
                  <Icon :name="['fab', 'github']" color="inherit" />
                </a>
              </div>
            </div>
          </div>
          <AppSearchAlgolia :options="algoliaSettings" />
          <div class="flex lg:hidden">
            <!-- Mobile menu button -->
            <button
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
              @click="toggleMenu"
            >
              <span class="sr-only">Open main menu</span>
              <!-- Icon when menu is closed. -->
              <!--
            Heroicon name: menu

            Menu open: "hidden", Menu closed: "block"
          -->
              <svg
                class="block h-6 w-6 stroke-current text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <!-- Icon when menu is open. -->
              <!--
            Heroicon name: x

            Menu open: "block", Menu closed: "hidden"
          -->
              <svg
                class="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!--
    Mobile menu, toggle classes based on menu state.

    Menu open: "block", Menu closed: "hidden"
    -->
      <div
        :class="isMenuOpen ? 'block' : 'hidden'"
        class="lg:hidden overflow-y-auto"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <nuxt-link
            v-for="(link, index) in navLink"
            :key="`header-nav-link-${index}`"
            :to="link.path"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {{ link.label }}
          </nuxt-link>
          <a
            href="https://learn.cypress.io"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Learn
          </a>
          <a
            href="https://github.com/cypress-io/cypress"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            GitHub
          </a>
          <app-header-mobile-section
            v-for="(group, index) in mobileMenuItems"
            :key="`navgroup-${index}`"
            :name="group.slug"
            :title="group.title"
            :folder="group.slug"
            :section="section"
            :parent-section="group.slug"
            :children="group.children"
          />
        </div>
      </div>
    </nav>
  </div>
</template>
