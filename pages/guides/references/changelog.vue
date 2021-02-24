<script>
import AppSidebar from '../../../components/AppSidebar'
import AppHeader from '../../../components/AppHeader'
import TableOfContents from '../../../components/TableOfContents'
import Footer from '../../../components/Footer'

export default {
  components: {
    AppSidebar,
    AppHeader,
    TableOfContents,
    Footer,
  },
  async asyncData({ $content, app, params, error }) {
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const changelogs = await $content('_changelogs').fetch()

    const sortedChangelogs = changelogs.sort((a, b) => {
      // descending order
      const A_LESS_THAN_B = 1
      const A_GREATER_THAN_B = -1
      const A_EQUALS_B = 0

      const [aMaj, aMin, aPatch] = a.slug.split('.').map((x) => Number(x))
      const [bMaj, bMin, bPatch] = b.slug.split('.').map((x) => Number(x))

      if (aMaj > bMaj) {
        return A_GREATER_THAN_B
      }

      if (aMaj < bMaj) {
        return A_LESS_THAN_B
      }

      if (aMin > bMin) {
        return A_GREATER_THAN_B
      }

      if (aMin < bMin) {
        return A_LESS_THAN_B
      }

      if (aPatch > bPatch) {
        return A_GREATER_THAN_B
      }

      if (aPatch < bPatch) {
        return A_LESS_THAN_B
      }

      return A_EQUALS_B
    })

    const tableOfContents = sortedChangelogs.map((item) => {return {
      id: item.slug.replace(/\./g, ''),
      depth: 1,
      text: item.slug,
    }})

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

    if (!changelogs || (Array.isArray(changelogs) && changelogs.length === 0)) {
      return error({ statusCode: 404, message: 'Changelogs not found' })
    }

    return {
      algoliaSettings,
      changelogs: sortedChangelogs,
      guideSidebar: items,
      path: 'changelog',
      tableOfContents,
    }
  },
  head() {
    return {
      title: 'Changelog',
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
        <article class="main-content-article">
          <h1 class="main-content-title">Changelog</h1>
          <nuxt-content
            v-for="(changelog, index) in changelogs"
            :key="`changelog-${index}`"
            :document="changelog"
          ></nuxt-content>
          <Footer />
        </article>
      </div>
      <TableOfContents :toc="tableOfContents" />
    </main>
  </div>
</template>

<style lang="scss">
@import '../../../styles/content.scss';
</style>
