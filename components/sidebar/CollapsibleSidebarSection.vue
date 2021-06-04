<script>
export default {
  name: 'CollapsibleSidebarSection',
  props: {
    section: {
      type: String,
      required: true,
    },
    parentSection: {
      type: String,
      required: false,
      default: '',
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
       * { title: string, slug: string }[]
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
    /**
     * @description
     * Affects the amount of padding-left applied.
     * This component can contain children of the same type,
     * so each nested component of this type should be indented
     * to the right.
     */
    depth: {
      type: Number,
      required: false,
      default: 1,
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
  },
}
</script>

<template>
  <div
    :class="
      depth > 1
        ? `ml-${depth + 3} pl-2 border-l-2 border-gray-200`
        : 'px-4 pb-4'
    "
    class="space-y-1"
    :data-test="folder"
  >
    <button
      class="group w-full flex items-center text-left px-2 pl-4 pr-1 text-lg font-bold bg-lightGray text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
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
    <ul
      :class="isOpen ? '' : 'hidden'"
      class="space-y-1 m-0"
      :data-test="`${label}-children`"
    >
      <div
        v-for="(child, index) in children"
        :key="`collapsible-sidebar-section-${index}`"
      >
        <CollapsibleSidebarSection
          v-if="child.children"
          :label="child.title"
          :folder="child.slug"
          :section="
            parentSection ? section.concat(`/`).concat(parentSection) : section
          "
          :parent-section="parentSection"
          :children="child.children"
          :initial-is-open="path.includes(child.slug)"
          :path="path"
          :name="child.slug"
          :depth="depth + 1"
        />
        <li v-else>
          <nuxt-link
            :to="child.redirect || `/${section}/${folder}/${child.slug}`"
            :class="
              path.includes(`${folder}/${child.slug}`)
                ? 'active-sidebar-link'
                : 'text-gray-600'
            "
            class="rounded-md group w-full flex items-center pl-4 pr-2 py-1 text-md font-medium hover:text-green transition-colors hover:bg-gray-50"
          >
            {{ child.title }}
          </nuxt-link>
        </li>
      </div>
    </ul>
  </div>
</template>

<style scoped>
.active-sidebar-link {
  color: #127458;
  background-color: #cff1e6;
}
</style>
