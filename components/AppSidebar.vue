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
        :initial-is-open="path.includes(sidebarGroup.folder)"
        :path="path"
      />
    </div>
  </aside>
</template>
