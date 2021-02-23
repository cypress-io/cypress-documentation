<script>
import CollapsibleSidebarSection from './sidebar/CollapsibleSidebarSection'

export default {
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
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
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
      class="mt-5 pt-16 fixed top-0 bottom-0 left-0 right-0 overflow-y-auto lg:w-sidebar flex-grow flex flex-col overflow-y-auto hide-scroll"
    >
      <CollapsibleSidebarSection
        v-for="(sidebarGroup, index) in items"
        :key="`sidebar-group-${index}`"
        :label="sidebarGroup.label"
        :folder="sidebarGroup.folder"
        :section="section"
        :children="sidebarGroup.children"
        :initial-is-open="false"
        :path="path"
      />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.app-sidebar {
  ul,
  li {
    @apply list-none;
  }
}

.app-sidebar-link {
  display: block;
  font-weight: 500;
  @apply py-1;
  @apply px-8;
}

.app-sidebar-sticky {
  position: sticky;
  top: 0;
  height: calc(100vh - 35px);
  overflow-y: auto;
}

.app-sidebar-heading {
  @apply mb-2;
  @apply px-8;
  // @apply text-gray-500;
  @apply uppercase;
  @apply tracking-wider;
  @apply font-bold;
  @apply text-xs;
}

.app-sidebar-nav {
  @apply py-4;
}

.nuxt-link-exact-active {
  color: #fff;
  font-weight: 600;
  background-color: #1dbe89;
}
</style>
