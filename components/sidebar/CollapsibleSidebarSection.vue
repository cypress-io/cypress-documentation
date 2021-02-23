<script>
import { getSidebarItemLink } from './getSidebarItemLink'

export default {
  props: {
    section: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    children: {
      /**
       * @type
       * { label: string, slug: string }[]
       */
      type: Array,
      required: true,
    },
    initialIsOpen: {
      type: Boolean,
      required: false,
      default: false,
    },
    path: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isOpen: this.initialIsOpen,
    }
  },
  watch: {
    path: {
      handler: 'scrollToActiveLink',
    },
  },
  mounted() {
    this.scrollToActiveLink()
  },
  methods: {
    getSidebarItemLink,
    toggleSection() {
      this.isOpen = !this.isOpen
    },
    scrollToActiveLink() {
      const el = this.$el.getElementsByClassName('active-sidebar-link')[0]
      if (el) {
        // delaying the call to scrollIntoView prevents the sidebar from
        // sometimes trying to scroll to the active link too soon.
        const SCROLL_AFTER_MS = 50
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, SCROLL_AFTER_MS)
      }
    },
    isCurrentPathInSection(path, slug) {
      if (path === slug) {
        this.isOpen = true
      }
      return path === slug
    },
  },
}
</script>

<template>
  <div class="space-y-1 px-4 pb-4">
    <button
      class="group w-full flex items-start text-left px-2 pl-4 pr-1 text-lg font-bold bg-lightGray text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
      @click="toggleSection"
    >
      {{ label }}
      <!-- Expanded: "text-gray-400 rotate-90", Collapsed: "text-gray-300" -->
      <svg
        :class="isOpen ? 'text-gray-400 rotate-90' : 'text-gray-300'"
        class="ml-auto h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
      </svg>
    </button>
    <!-- Expandable link section, show/hide based on state. -->
    <ul :class="isOpen ? '' : 'hidden'" class="space-y-1 m-0">
      <li
        v-for="(child, index) in children"
        :key="`collapsible-sidebar-section-${index}`"
      >
        <nuxt-link
          :to="
            getSidebarItemLink({
              section,
              folder,
              slug: child.slug,
            })
          "
          :class="
            isCurrentPathInSection(path, child.slug)
              ? 'active-sidebar-link text-white bg-cyGreen'
              : 'text-gray-600'
          "
          class="rounded-md group w-full flex items-center pl-4 pr-2 py-1 text-md font-medium hover:text-green transition-colors hover:bg-gray-50"
        >
          {{ child.label }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
