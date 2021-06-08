<script>
export default {
  data() {
    return {
      apiTocList: [],
    }
  },
  async fetch() {
    const { api } = await this.$content('_data/sidebar').fetch()
    const apiTocList = api[0].children

    this.apiTocList = apiTocList
  },
}
</script>

<template>
  <div>
    <ul>
      <li
        v-for="section in apiTocList"
        :key="`${section.slug || section.redirect}`"
        class="mb-8"
      >
        <h2 class="text-2xl pb-2 mb-4 font-bold border-b border-gray-200">
          {{ section.title }}
        </h2>
        <ul>
          <li
            v-for="item in section.children"
            :key="`${item.redirect || item.slug}`"
            class="mb-4"
          >
            <NuxtLink
              :to="item.redirect || `/${section.slug}/${item.slug}`"
              class="text-blue border-b border-dotted hover:border-transparent"
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
