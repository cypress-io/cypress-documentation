<script>
import AppSidebar from '@/components/AppSidebar'
import AppHeader from '@/components/AppHeader'
import TableOfContentsList from '@/components/TableOfContentsList'
import Footer from '@/components/Footer'
import { getMetaData, getMetaDescription, getTitle } from '../../../utils'
import { fetchBanner } from '../../../utils/sanity'

export default {
  components: {
    AppSidebar,
    AppHeader,
    TableOfContentsList,
    Footer,
  },
  async asyncData({ $content, app, params, error }) {
    const path = '/guides/references/error-messages'
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const [guide] = await $content({ deep: true }).where({ path }).fetch()
    const { guides } = await $content('_data/sidebar').fetch()
    const sidebarItems = guides[0].children

    if (!guide) {
      return error({ statusCode: 404, message: 'Guide not found' })
    }

    const [rawContent] = await $content({ deep: true, text: true })
      .where({ path })
      .fetch()
    const metaDescription = await getMetaDescription(rawContent.text)

    const banner = await fetchBanner()

    return {
      algoliaSettings,
      guide,
      sidebarItems,
      path: 'references/error-messages',
      metaDescription,
      banner,
    }
  },
  head() {
    return {
      title: getTitle(this.guide.title),
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
        title: getTitle(this.guide.title),
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
          <h1 class="main-content-title">{{ guide.title }}</h1>
          <div class="w-full flex flex-col justify-between">
            <TableOfContentsList :toc="guide.toc" />
            <nuxt-content :document="guide"></nuxt-content>
            <Footer />
          </div>
        </article>
      </div>
    </main>
  </div>
</template>
