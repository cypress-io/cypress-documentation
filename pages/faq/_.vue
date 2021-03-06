<script>
import AppSidebar from '../../components/AppSidebar'
import AppHeader from '../../components/AppHeader'
import Footer from '../../components/Footer'
import TableOfContents from '../../components/TableOfContents'
import TableOfContentsList from '../../components/TableOfContentsList.vue'
import { getMetaData } from '../../utils/getMetaData'
import { getMetaDescription } from '../../utils/getMetaDescription'

export default {
  components: {
    AppSidebar,
    AppHeader,
    Footer,
    TableOfContents,
    TableOfContentsList,
  },
  async asyncData({ $content, app, params, error }) {
    const path = `/faq/${params.pathMatch || 'index'}`
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const [faqItem] = await $content({ deep: true }).where({ path }).fetch()
    const { faq: sidebar } = await $content('_data/sidebar').fetch()
    const {
      sidebar: { faq: userFriendlyNameMap },
    } = await $content('_data/en').fetch()

    const faqSidebarItems = Object.keys(sidebar).map((key) => {return {
      label: userFriendlyNameMap[key],
      badge: '',
      children: Object.keys(sidebar[key]).map((nestedKey) => {
        return {
          slug: nestedKey,
          label: userFriendlyNameMap[nestedKey],
        }
      }),
      folder: key,
    }})

    if (!faqItem) {
      return error({ statusCode: 404, message: 'FAQ not found' })
    }

    const [rawContent] = await $content({ deep: true, text: true }).where({ path }).fetch()
    const metaDescription = await getMetaDescription(rawContent.text)

    return {
      algoliaSettings,
      faqItem,
      faqSidebarItems,
      metaDescription,
      path: params.pathMatch,
    }
  },
  head() {
    return {
      title: this.faqItem.title,
      meta: this.meta,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://docs.cypress.io/faq/${this.$route.params.pathMatch}`
        }
      ]
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: this.faqItem.title,
        description: this.metaDescription,
        url: `https://docs.cypress.io/faq/${this.$route.params.pathMatch}`
      }

      return getMetaData(metaData)
    }
  }
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      :mobile-menu-items="faqSidebarItems"
      section="faq"
      :algolia-settings="algoliaSettings"
    />
    <main class="main-content">
      <AppSidebar :items="faqSidebarItems" section="faq" :path="path" />
      <div class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll">
          <h1 class="main-content-title">{{ faqItem.title }}</h1>
          <div class="w-full flex flex-col justify-between">
            <TableOfContentsList :toc="faqItem.toc" />
            <nuxt-content :document="faqItem"></nuxt-content>
            <Footer />
          </div>
        </article>
      </div>
      <TableOfContents />
    </main>
  </div>
</template>

<style lang="scss">
@import '../../styles/content.scss';
</style>
