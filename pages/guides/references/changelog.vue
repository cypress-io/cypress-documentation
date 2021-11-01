<script>
import AppSidebar from '@/components/AppSidebar'
import AppHeader from '@/components/AppHeader'
import TableOfContents from '@/components/TableOfContents'
import Footer from '@/components/Footer'
import MainContentHeader from '@/components/MainContentHeader'
import { getMetaData, getMetaDescription, getTitle } from '@/utils'
import { fetchBanner } from '@/utils/sanity'

const sortChangelogs = (a, b) => {
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
}

export default {
  components: {
    AppSidebar,
    AppHeader,
    TableOfContents,
    Footer,
    MainContentHeader
  },
  async asyncData({ $content, app, params, error }) {
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const changelogs = await $content('_changelogs').fetch()

    const sortedChangelogs = changelogs.sort(sortChangelogs)

    const tableOfContents = sortedChangelogs.map((item) => {
      return {
        id: item.slug.replace(/\./g, '-'),
        depth: 1,
        text: item.slug,
      }
    })

    const { guides } = await $content('_data/sidebar').fetch()
    const sidebarItems = guides[0].children

    if (!changelogs || (Array.isArray(changelogs) && changelogs.length === 0)) {
      return error({ statusCode: 404, message: 'Changelogs not found' })
    }

    const markdownChangelogs = await $content({ deep: true, text: true })
      .where({ path: '_changelogs' })
      .fetch()
    const sortedMarkdownChangelogs = markdownChangelogs
      .sort(sortChangelogs)
      .slice(0, 3)
    const recentChangelogsText = sortedMarkdownChangelogs.reduce(
      (all, item) => {
        return `${all + item.text}\n`
      },
      ''
    )

    const metaDescription = await getMetaDescription(recentChangelogsText)

    const banner = await fetchBanner()

    return {
      algoliaSettings,
      changelogs: sortedChangelogs,
      sidebarItems,
      path: 'references/changelog',
      tableOfContents,
      metaDescription,
      banner,
    }
  },
  head() {
    return {
      title: getTitle('Changelog'),
      meta: this.meta,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://docs.cypress.io/guides/${this.path}`,
        },
      ],
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: getTitle('Changelog'),
        description: this.metaDescription,
        url: `https://docs.cypress.io/guides/${this.path}`,
      }

      return getMetaData(metaData)
    },
  },
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      :mobile-menu-items="sidebarItems"
      section="guides"
      :algolia-settings="algoliaSettings"
      :banner="banner"
    />
    <main :class="Boolean(banner) ? 'banner-margin' : ''" class="main-content">
      <AppSidebar
        :items="sidebarItems"
        section="guides"
        :path="path"
        :has-banner="Boolean(banner)"
      />
      <div class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll">
          <MainContentHeader title="Changelog" />
          <nuxt-content
            v-for="(changelog, index) in changelogs"
            :key="`changelog-${index}`"
            :document="changelog"
          ></nuxt-content>
          <Footer />
        </article>
      </div>
      <TableOfContents :toc="tableOfContents" :has-banner="Boolean(banner)" />
    </main>
  </div>
</template>
