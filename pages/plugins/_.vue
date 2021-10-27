<script>
import AppHeader from '@/components/AppHeader'
import PluginsList from '@/components/PluginsList.vue'
import Footer from '@/components/Footer'
import { getMetaData, getMetaDescription, getTitle } from '../../utils'
import { fetchBanner } from '../../utils/sanity'

export default {
  components: {
    AppHeader,
    PluginsList,
    Footer,
  },
  async asyncData({ $content, app, params, error }) {
    const path = `/plugins/${params.pathMatch || 'index'}`
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const [pluginDoc] = await $content({ deep: true }).where({ path }).fetch()
    const { plugins } = await $content('_data/plugins').fetch()

    if (!pluginDoc) {
      return error({ statusCode: 404, message: 'Plugin Doc not found' })
    }

    const [rawContent] = await $content({ deep: true, text: true })
      .where({ path })
      .fetch()
    const metaDescription = await getMetaDescription(rawContent.text)

    const banner = await fetchBanner()

    return {
      algoliaSettings,
      pluginDoc,
      plugins,
      metaDescription,
      banner,
    }
  },
  head() {
    return {
      title: getTitle(this.pluginDoc.title),
      meta: this.meta,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://docs.cypress.io/plugins/${this.$route.params.pathMatch}`,
        },
      ],
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: getTitle(this.pluginDoc.title),
        description: this.metaDescription,
        url: `https://docs.cypress.io/plugins/${this.$route.params.pathMatch}`,
      }

      return getMetaData(metaData)
    },
  },
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      section="plugins"
      :algolia-settings="algoliaSettings"
      :banner="banner"
    />
    <main :class="Boolean(banner) ? $style.bannerMargin : ''" class="pt-16">
      <div class="mt-16 mx-16">
        <article class="w-full">
          <h1 class="main-content-header">{{ pluginDoc.title }}</h1>
          <nuxt-content :document="pluginDoc"></nuxt-content>
          <PluginsList :list="plugins" />
          <Footer />
        </article>
      </div>
    </main>
  </div>
</template>

<style module>
.bannerMargin {
  margin-top: 48px;
}
</style>
