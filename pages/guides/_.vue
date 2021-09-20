<script>
import AppSidebar from '../../components/AppSidebar'
import AppHeader from '../../components/AppHeader'
import TableOfContents from '../../components/TableOfContents'
import Footer from '../../components/Footer'
import { getMetaData, getMetaDescription, getTitle } from '../../utils'
import { fetchBanner } from '../../utils/sanity'

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

    const { joke }= await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json())


    return {
      joke,
      algoliaSettings,
      guide,
      sidebarItems,
      metaDescription,
      path: params.pathMatch,
      banner,
    }
  },
  head() {
    return {
      title:
        getTitle(this.guide && this.guide.title) || 'Cypress Documentation',
      meta: this.meta,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://docs.cypress.io/guides/${this.$route.params.pathMatch}`,
        },
      ],
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title:
          getTitle(this.guide && this.guide.title) || 'Cypress Documentation',
        description: this.metaDescription,
        url: `https://docs.cypress.io/guides/${this.$route.params.pathMatch}`,
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
      :banner="banner"
      :algolia-settings="algoliaSettings"
    />
    <main :class="Boolean(banner) ? 'banner-margin' : ''" class="main-content">
      <AppSidebar
        :has-banner="Boolean(banner)"
        :items="sidebarItems"
        section="guides"
        :path="path"
      />
      <div class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll">
          <h1 class="main-content-title">
            {{ (guide && guide.title) || 'Cypress Documentation' }}
          </h1>
          <nuxt-content :document="guide"></nuxt-content>
          <div data-test="joke">{{ joke }}</div>
          <Footer />
        </article>
      </div>
      <TableOfContents
        :toc="guide && guide.toc"
        :has-banner="Boolean(banner)"
      />
    </main>
  </div>
</template>
