<script>
import CollapsibleSidebarSection from './CollapsibleSidebarSection'

export default {
  name: 'Root',
  components: {
    CollapsibleSidebarSection,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    path: {
      type: String,
      required: false,
      default: '',
    },
    section: {
      type: String,
      default: '',
      validator: (value) => {
        return ['', 'api', 'examples', 'faq', 'guides', 'plugins'].includes(
          value.toLowerCase()
        )
      },
    },
    hasBanner: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  methods: {
    shouldBeInitiallyOpen(slug) {
      /**
       * This is a hack. The API Table of Contents page, i.e. `/api/table-of-contents`,
       * doesn't start with the API section expanded (the section of the current page
       * should start in the expanded/open state). Every other section seems to work,
       * and I didn't want to spend too much time troubleshooting this.
       */
      if (slug === 'api' && this.path === '/table-of-contents') {
        return true
      }

      const isOpen = this.path.includes(slug)

      return isOpen
    },
  },
}
</script>

<template>
  <aside
    class="app-sidebar hide-scroll hidden lg:flex lg:w-sidebar lg:col-span-3 xl:col-span-2 top-0 left-0 bottom-0 flex-col border-r border-b border-gray-200 mt-16 bg-lightGray overflow-y-auto"
    role="navigation"
  >
    <div
      :class="hasBanner ? $style.bannerMargin : ''"
      class="mt-5 pt-16 fixed top-0 bottom-0 left-0 right-0 overflow-y-auto lg:w-sidebar flex-grow flex flex-col hide-scroll"
    >
      <CollapsibleSidebarSection
        v-for="(group, index) in items"
        :key="`sidebar-group-${index}`"
        :label="group.title"
        :folder="group.slug"
        :section="section"
        :parent-section="group.slug"
        :children="group.children"
        :initial-is-open="shouldBeInitiallyOpen(group.slug)"
        :path="path"
      />
    </div>
  </aside>
</template>

<style module>
.bannerMargin {
  margin-top: 80px;
}
</style>
