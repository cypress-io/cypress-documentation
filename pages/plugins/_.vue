<script>
import AppHeader from '@/components/AppHeader'
import PluginsList from '@/components/PluginsList.vue'
import Footer from '@/components/Footer'

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

    return {
      algoliaSettings,
      pluginDoc,
      plugins,
    }
  },
  head() {
    return {
      title: this.pluginDoc.title,
    }
  },
}
</script>

<template>
  <div class="w-full">
    <AppHeader section="plugins" :algolia-settings="algoliaSettings" />
    <main class="pt-16">
      <div class="mt-16 mx-16">
        <article class="w-full">
          <h1 class="main-content-title">{{ pluginDoc.title }}</h1>
          <nuxt-content :document="pluginDoc"></nuxt-content>
          <PluginsList :list="plugins" />
          <Footer />
        </article>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
@import '../../styles/content.scss';
</style>
