<script>
const TOC_TYPES = {
  SECTION_HEADER: 'SECTION_HEADER',
  LIST_ITEM: 'LIST_ITEM',
}

export default {
  async fetch() {
    const { api: sidebar } = await this.$content('_data/sidebar').fetch()
    const {
      sidebar: { api: userFriendlyNameMap },
    } = await this.$content('_data/en').fetch()

    const { api, ...rest } = sidebar

    /**
     * We want to flatten the `api` section of the `sidebar.json`.
     * We create a flat list of items that can be one of two types:
     *   1. TOC_TYPES.SECTION_HEADER
     *   2. TOC_TYPES.LIST_ITEM
     * We use a flattened list since it is easy to iterate over, and
     * we will check the `type` field to determine whether or not to
     * render a section header or a list item.
     */
    const apiTocList = Object.keys(rest).reduce((all, slug) => {
      return [
        ...all,
        {
          id: slug,
          text: userFriendlyNameMap[slug],
          type: TOC_TYPES.SECTION_HEADER,
          children: Object.keys(rest[slug]).reduce((allNested, nestedSlug) => {
            const link =
              slug === 'all-assertions'
                ? 'guides/references/assertions'
                : `${slug}/${nestedSlug}`
            return [
              ...allNested,
              {
                id: link,
                text: userFriendlyNameMap[nestedSlug],
                type: TOC_TYPES.LIST_ITEM,
                link,
              },
            ]
          }, []),
        },
      ]
    }, [])

    this.apiTocList = apiTocList
  },
  data() {
    return {
      apiTocList: [],
    }
  },
}
</script>

<template>
  <div>
    <ul>
      <li v-for="section in apiTocList" :key="`${section.id}`" class="mb-8">
        <h2 class="text-2xl pb-2 mb-4 font-bold border-b border-gray-200">
          {{ section.text }}
        </h2>
        <ul>
          <li v-for="item in section.children" :key="`${item.id}`" class="mb-4">
            <NuxtLink
              :to="item.link"
              class="text-blue border-b border-dotted hover:border-transparent"
            >
              {{ item.text }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/content.scss';
</style>
