<script>
import AppSidebar from '../../components/AppSidebar'
import AppHeader from '../../components/AppHeader'
import Footer from '../../components/Footer'
import LearnNextBtn from '../../components/learn/LearnNextBtn.vue'
import LearnNavigation from '../../components/learn/LearnNavigation.vue'
import TableOfContents from '../../components/TableOfContents'
import TableOfContentsList from '../../components/TableOfContentsList.vue'
import { getMetaData, getMetaDescription, getTitle } from '../../utils'
import { fetchBanner } from '../../utils/sanity'
import { mapMutations } from 'vuex';

export default {
  components: {
    AppSidebar,
    AppHeader,
    Footer,
    LearnNextBtn,
    LearnNavigation,
    TableOfContents,
    TableOfContentsList,
  },
  async asyncData({ $content, app, params, error }) {
    const path = `/learn/${params.pathMatch || 'index'}`
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const [learnItem] = await $content({ deep: true }).where({ path }).fetch()

    if (!learnItem) {
      return error({ statusCode: 404, message: 'Document not found' })
    }

    const [rawContent] = await $content({ deep: true, text: true })
      .where({ path })
      .fetch()
    const metaDescription = await getMetaDescription(rawContent.text)

    const banner = await fetchBanner()

    return {
      algoliaSettings,
      learnItem,
      metaDescription,
      path: params.pathMatch,
      banner,
    }
  },
  head() {
    return {
      title: getTitle(this.learnItem.title),
      meta: this.meta,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://docs.cypress.io/learn/${this.$route.params.pathMatch}`,
        },
      ],
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: getTitle(this.learnItem.title),
        description: this.metaDescription,
        url: `https://docs.cypress.io/learn/${this.$route.params.pathMatch}`,
      }

      return getMetaData(metaData)
    },
  },
  
  created() {
    this.$nextTick(() => {
      this.updateCurrentLesson(this.$route.path)
      this.updateCurrentSection(this.$route.path.split("/")[2])
    })
  },
  
  methods: {
    ...mapMutations({
      updateCurrentLesson: 'learn/updateCurrentLesson',
      updateCurrentSection: 'learn/updateCurrentSection',
    }),
  }
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      section="learn"
      :algolia-settings="algoliaSettings"
      :banner="banner"
    />
    
    <main :class="Boolean(banner) ? 'banner-margin' : ''" class="main-content">
      <AppSidebar :path="path" :has-banner="Boolean(banner)" />
      <div class="main-content-article-wrapper">
        <div class="w-full flex flex-col justify-between">
          <TableOfContentsList :toc="learnItem.toc" />
            <nuxt-content :document="learnItem"></nuxt-content>
            <LearnNextBtn />
            <br />
            <br />
            <br />
            <LearnNavigation />
          <Footer />
        </div>
      </div>
      <TableOfContents />
    </main>
  </div>
</template>
