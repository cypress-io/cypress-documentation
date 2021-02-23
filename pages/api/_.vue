<script>
import AppSidebar from '../../components/AppSidebar'
import TableOfContents from '../../components/TableOfContents'
import Footer from '../../components/Footer'
import ApiTableOfContents from '../../components/ApiTableOfContents.vue'

export default {
  components: {
    AppSidebar,
    TableOfContents,
    ApiTableOfContents,
    Footer,
  },
  async asyncData({ $content, app, params, redirect, error }) {
    const path = `/api/${params.pathMatch || 'index'}`
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const [apiPageContent] = await $content({ deep: true })
      .where({ path })
      .fetch()
    const { api: sidebar } = await $content('_data/sidebar').fetch()
    const {
      sidebar: { api: userFriendlyNameMap },
    } = await $content('_data/en').fetch()

    const items = Object.keys(sidebar).map((key) => ({
      label: userFriendlyNameMap[key],
      badge: '',
      children: Object.keys(sidebar[key]).map((nestedKey) => {
        let slug = nestedKey
        // Some slugs might not match the file name exactly.
        // E.g. "dashboard-introduction.md" doesn't exist, but "introduction.md"
        // within the "dashboard" directory does. This checks for instances of
        // the directory name being included in the file name, and if so, removes it
        // from the slug.
        if (nestedKey.includes(key)) {
          slug = nestedKey.replace(`${key}-`, '')
        }
        return {
          slug,
          label: userFriendlyNameMap[nestedKey],
        }
      }),
      folder: key === 'api' ? '' : key,
    }))

    if (!apiPageContent) {
      return error({
        statusCode: 404,
        message: `API page not found for path: ${path}`,
      })
    }

    const isApiToc = params.pathMatch.includes('table-of-contents')

    const paramParts = params.pathMatch.split('/')
    const slug = paramParts[paramParts.length - 1]

    return {
      apiPageContent,
      apiSidebar: items,
      algoliaSettings,
      isApiToc,
      path: slug,
    }
  },
  data() {
    return {
      isMenuOpen: false,
    }
  },
  methods: {
    onToggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
  },
  head() {
    return {
      title: this.apiPageContent.title,
    }
  },
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      :mobile-menu-items="apiSidebar"
      section="api"
      :algolia-settings="algoliaSettings"
    />
    <main class="main-content">
      <AppSidebar :items="apiSidebar" section="api" :path="path" />
      <div class="main-content-article-wrapper">
        <article class="main-content-article">
          <h1 class="main-content-title">{{ apiPageContent.title }}</h1>
          <nuxt-content v-if="!isApiToc" :document="apiPageContent" />
          <ApiTableOfContents v-if="isApiToc" />
          <Footer />
        </article>
      </div>
      <TableOfContents :toc="apiPageContent.toc" />
    </main>
  </div>
</template>

<style lang="scss">
@import '../../styles/content.scss';

h3 a:nth-child(2) {
  @apply ml-1;
}

a > svg {
  @apply text-blue;
}
</style>
