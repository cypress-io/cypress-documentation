<script>
import AppSidebar from '../../components/AppSidebar'
import AppHeader from '../../components/AppHeader'
import TableOfContents from '../../components/TableOfContents'
import Footer from '../../components/Footer'

export default {
  components: {
    AppSidebar,
    AppHeader,
    TableOfContents,
    Footer,
  },
  async asyncData({ $content, app, params, error }) {
    const path = `/guides/${params.pathMatch || 'index'}`
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const [guide] = await $content({ deep: true }).where({ path }).fetch()
    const { guides: sidebar } = await $content('_data/sidebar').fetch()
    const {
      sidebar: { guides: userFriendlyNameMap },
    } = await $content('_data/en').fetch()

    const items = Object.keys(sidebar).map((key) => {return {
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
      folder: key,
    }})

    if (!guide) {
      return error({ statusCode: 404, message: 'Guide not found' })
    }

    return {
      algoliaSettings,
      guide,
      guideSidebar: items,
      path: params.pathMatch,
    }
  },
  head() {
    return {
      title: this.guide.title,
    }
  },
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      :mobile-menu-items="guideSidebar"
      section="guides"
      :algolia-settings="algoliaSettings"
    />
    <main class="main-content">
      <AppSidebar :items="guideSidebar" section="guides" :path="path" />
      <div class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll">
          <h1 class="main-content-title">{{ guide.title }}</h1>
          <nuxt-content :document="guide"></nuxt-content>
          <Footer />
        </article>
      </div>
      <TableOfContents :toc="guide.toc" />
    </main>
  </div>
</template>

<style lang="scss">
@import '../../styles/content.scss';
</style>
