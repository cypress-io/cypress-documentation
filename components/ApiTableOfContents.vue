<script>
const startWithApi = (path) => {
  if (path.startsWith('api')) {
    return `/${path}`
  }

  return `/api/${path}`
}

export default {
  data() {
    return {
      apiTocList: [],
    }
  },
  async fetch() {
    const { api: sidebar } = await this.$content('_data/sidebar').fetch()
    const {
      sidebar: { api: userFriendlyNameMap },
    } = await this.$content('_data/en').fetch()

    const { ...rest } = sidebar

    const apiTocList = Object.keys(rest).reduce((all, slug) => {
      return [
        ...all,
        {
          id: slug,
          text: userFriendlyNameMap[slug],
          children: Object.keys(rest[slug]).reduce((allNested, nestedSlug) => {
            const link =
              nestedSlug === 'all-assertions'
                ? '/guides/references/assertions'
                : startWithApi(`${slug}/${nestedSlug}`)

            return [
              ...allNested,
              {
                id: link,
                text: userFriendlyNameMap[nestedSlug],
                link,
              },
            ]
          }, []),
        },
      ]
    }, [])

    this.apiTocList = apiTocList
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
