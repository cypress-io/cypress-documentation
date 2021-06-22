<script>
import Vue from 'vue'
import AppSidebar from '../../components/AppSidebar'
import TableOfContents from '../../components/TableOfContents'
import Footer from '../../components/Footer'
import ApiTableOfContents from '../../components/ApiTableOfContents.vue'
import AppCopyButton from '../../components/AppCopyButton'
import { getMetaData, getMetaDescription, getTitle } from '../../utils'
import { fetchBanner } from '../../utils/sanity'

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
    const { api } = await $content('_data/sidebar').fetch()
    const sidebarItems = api[0].children

    if (!apiPageContent) {
      return error({
        statusCode: 404,
        message: `API page not found for path: ${path}`,
      })
    }

    const isApiToc = params.pathMatch.includes('table-of-contents')
    const activeSidebarItem = isApiToc ? '/table-of-contents' : params.pathMatch

    const [rawContent] = await $content({ deep: true, text: true })
      .where({ path })
      .fetch()
    const metaDescription = isApiToc
      ? 'Cypress API Documentation Table of Contents '
      : await getMetaDescription(rawContent.text)

    const banner = await fetchBanner()

    return {
      apiPageContent,
      sidebarItems,
      algoliaSettings,
      isApiToc,
      metaDescription,
      path: activeSidebarItem,
      banner,
    }
  },
  data() {
    return {
      isMenuOpen: false,
    }
  },
  head() {
    return {
      title: getTitle(this.apiPageContent.title),
      meta: this.meta,
      links: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://docs.cypress.io/api/${this.$route.params.pathMatch}`,
        },
      ],
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: getTitle(this.apiPageContent.title),
        description: this.metaDescription,
        url: `https://docs.cypress.io/api/${this.$route.params.pathMatch}`,
      }

      return getMetaData(metaData)
    },
  },
  mounted() {
    setTimeout(() => {
      const blocks = document.getElementsByTagName('pre')

      for (const block of blocks) {
        const textContent =
          block.parentElement.previousElementSibling.textContent

        // only append copy button if not a demo of incorrect usage
        if (!textContent.toLowerCase().includes('incorrect usage')) {
          const CopyButton = Vue.extend(AppCopyButton)
          const component = new CopyButton().$mount()

          block.append(component.$el)
        }
      }
    }, 100)
  },
  methods: {
    onToggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
  },
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      :mobile-menu-items="sidebarItems"
      section="api"
      :algolia-settings="algoliaSettings"
      :banner="banner"
    />
    <main :class="Boolean(banner) ? 'banner-margin' : ''" class="main-content">
      <AppSidebar
        :items="sidebarItems"
        section="api"
        :path="path"
        :has-banner="Boolean(banner)"
      />
      <div class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll">
          <h1 class="main-content-title">{{ apiPageContent.title }}</h1>
          <nuxt-content v-if="!isApiToc" :document="apiPageContent" />
          <ApiTableOfContents v-if="isApiToc" />
          <Footer />
        </article>
      </div>
      <TableOfContents
        :toc="apiPageContent.toc"
        :has-banner="Boolean(banner)"
      />
    </main>
  </div>
</template>

<style module>
h3 a:nth-child(2) {
  @apply ml-1;
}

a > svg {
  @apply text-blue;
}
</style>
