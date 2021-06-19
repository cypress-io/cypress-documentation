<script>
import AppSidebar from '@/components/AppSidebar'
import AppHeader from '@/components/AppHeader'
import TableOfContents from '@/components/TableOfContents'
import Badge from '../../components/global/Badge.vue'
import { getMetaData, getMetaDescription, getTitle } from '../../utils'
import { fetchBanner } from '../../utils/sanity'

export default {
  components: {
    AppSidebar,
    AppHeader,
    TableOfContents,
    Badge,
  },
  async asyncData({ $content, app, params, error }) {
    const path = `/examples/${params.pathMatch || 'index'}`
    const { algolia: algoliaSettings } = await $content('settings').fetch()
    const [exampleItem] = await $content({ deep: true }).where({ path }).fetch()
    const { examples } = await $content('_data/sidebar').fetch()
    const sidebarItems = examples[0].children
    let mediaObject = {}
    let title = ''

    if (params.pathMatch.indexOf('-media') > 1) {
      const filename = params.pathMatch.split('/')[1]
      const mediaType = filename.split('-')[0]

      // The `courses.json` file includes a list of
      // courses that we need to fetch and display.
      // If we call $content(courses_file).fetch(),
      // the list of courses do not fall under a `courses`
      // key. We do a specific check for the `courses`
      // path here so we can take the list of courses
      // and put them under a `courses` key. No other
      // example page needs this type of data reformatting.
      if (params.pathMatch.includes('courses')) {
        const { courses } = await $content(`_data/${mediaType}`).fetch()

        mediaObject = {
          slug: 'courses',
          courses,
        }
      } else {
        mediaObject = await $content(`_data/${mediaType}`).fetch()
      }

      title = mediaType[0].toUpperCase() + mediaType.slice(1)
    }

    if (!exampleItem) {
      return error({ statusCode: 404, message: 'Example not found' })
    }

    const [rawContent] = await $content({ deep: true, text: true })
      .where({ path })
      .fetch()
    const metaDescription = await getMetaDescription(rawContent.text)

    const banner = await fetchBanner()

    return {
      algoliaSettings,
      exampleItem,
      sidebarItems,
      mediaObject,
      title,
      metaDescription,
      path: params.pathMatch,
      banner,
    }
  },
  head() {
    return {
      title: getTitle(this.exampleItem.title),
      meta: this.meta,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://docs.cypress.io/examples/${this.$route.params.pathMatch}`,
        },
      ],
    }
  },
  computed: {
    mediaObjectIsEmpty() {
      const hasNoKeys = Object.keys(this.mediaObject).length === 0
      const isObject = this.mediaObject.constructor === Object

      return hasNoKeys && isObject
    },
    isProjects() {
      return this.mediaObject.slug === 'projects'
    },
    isCourses() {
      return this.mediaObject.slug === 'courses'
    },
    isWebinars() {
      return this.mediaObject.slug === 'webinars'
    },
    isBlogs() {
      return this.mediaObject.slug === 'blogs'
    },
    isTalks() {
      return this.mediaObject.slug === 'talks'
    },
    isPodcasts() {
      return this.mediaObject.slug === 'podcasts'
    },
    isScreencasts() {
      return this.mediaObject.slug === 'screencasts'
    },
    meta() {
      const metaData = {
        type: 'article',
        title: getTitle(this.exampleItem.title),
        description: this.metaDescription,
        url: `https://docs.cypress.io/examples/${this.$route.params.pathMatch}`,
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
      section="examples"
      :algolia-settings="algoliaSettings"
      :banner="banner"
    />
    <main :class="Boolean(banner) ? 'banner-margin' : ''" class="main-content">
      <AppSidebar
        :items="sidebarItems"
        section="examples"
        :path="path"
        :has-banner="Boolean(banner)"
      />
      <div v-if="mediaObjectIsEmpty" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll">
          <h1 class="main-content-title">{{ exampleItem.title }}</h1>
          <nuxt-content :document="exampleItem"></nuxt-content>
          <Footer />
        </article>
      </div>
      <!--
      @todo
      Break apart these different pages into components and import.
      -->

      <!-- /* Projects */ -->
      <div v-if="isProjects" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll nuxt-content">
          <h1 class="main-content-title">{{ title }}</h1>
          <p>{{ mediaObject.description }}</p>
          <ul>
            <li v-for="item in mediaObject.projects" :key="`${item.url}`">
              <h3>
                <a :href="item.url" target="_blank" rel="noopener noreferrer">{{
                  item.name
                }}</a>
              </h3>
              <p>
                {{ item.description }}
              </p>
            </li>
          </ul>
          <Footer />
        </article>
      </div>

      <!-- /* Courses */ -->
      <div v-if="isCourses" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll nuxt-content">
          <h1 class="main-content-title">{{ title }}</h1>
          <p>
            Online courses from that teach end-to-end testing with Cypress over
            multiple videos. <strong>Note:</strong> Some of the courses require
            payment from their website.
          </p>
          <ul>
            <li
              v-for="item in mediaObject.courses"
              :key="`${item.url}`"
              class="project"
            >
              <a :href="`${item.url}`" target="_blank" class="font-bold">{{
                item.title
              }}</a>
              <p>
                Published on
                <a :href="`${item.sourceUrl}`">{{ item.sourceName }}</a> by
                <a
                  v-if="Boolean(item.authorTwitter)"
                  :href="`https://twitter.com/${item.authorTwitter}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ item.author }}</a
                >
                {{ item.authorTwitter ? '' : item.author }}
                <em v-if="Boolean(item.language)"
                  >, Language: {{ item.language }}
                </em>
                <Badge v-if="item.free" type="info">Free</Badge>
              </p>
            </li>
          </ul>
          <Footer />
        </article>
      </div>

      <!-- /* Webinars */ -->
      <div v-if="isWebinars" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll nuxt-content">
          <h1 class="main-content-title">{{ title }}</h1>
          <div class="mb-14">
            <ul>
              <li v-for="item in mediaObject.small" :key="`${item.url}`">
                <a :href="`${item.sourceUrl}`">{{ item.title }}</a>
              </li>
            </ul>
          </div>
          <div :class="$style.mediaContainer">
            <div
              v-for="item in mediaObject.large"
              :key="`${item.url}`"
              :class="$style.media"
              class="w-3/6 float-left"
            >
              <div class="relative mb-4 h-20">
                <a
                  :href="`https://youtube.com/watch?v=${item.youtubeId}`"
                  class="text-xl font-bold no-underline border-none absolute"
                >
                  {{ item.title }}
                </a>
              </div>
              <div class="mt-4">
                <iframe
                  :src="`https://www.youtube.com/embed/${item.youtubeId}`"
                  :frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                ></iframe>
              </div>
              <p class="mt-8 mb-8">
                Published on
                <a :href="item.sourceUrl">{{ item.sourceName }}</a> by
                {{ item.author }} <em>({{ item.date }})</em>
              </p>
            </div>
          </div>
          <Footer />
        </article>
      </div>

      <!-- /* Blogs */ -->
      <div v-if="isBlogs" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll nuxt-content">
          <h1 class="main-content-title">{{ title }}</h1>
          <div class="mb-14">
            <ul>
              <li v-for="item in mediaObject.small" :key="`${item.url}`">
                <a
                  :href="item.sourceUrl"
                  target="_blank"
                  rel="noopener noreferer"
                >
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>
          <div :class="$style.mediaContainer">
            <div
              v-for="item in mediaObject.large"
              :key="`${item.url}`"
              :class="$style.media"
              class="w-3/6 float-left"
            >
              <div class="relative mb-4 h-20">
                <a
                  :href="item.sourceUrl"
                  class="text-xl font-bold no-underline border-none absolute"
                >
                  {{ item.title }}
                </a>
              </div>
              <a :href="item.sourceUrl">
                <img
                  :src="require(`~/assets${item.img}`)"
                  :alt="`${item.title}`"
                />
              </a>
              <p>
                Published on
                <a :href="item.sourceUrl">{{ item.sourceName }}</a> by
                {{ item.author }} <em>({{ item.date }})</em>
              </p>
            </div>
          </div>
          <Footer />
        </article>
      </div>

      <!-- /* Talks */ -->
      <div v-if="isTalks" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll nuxt-content">
          <h1 class="main-content-title">{{ title }}</h1>
          <div class="mb-14">
            <ul>
              <li v-for="item in mediaObject.small" :key="`${item.url}`">
                <a :href="`${item.sourceUrl}`">{{ item.title }}</a>
              </li>
            </ul>
          </div>
          <div :class="$style.mediaContainer">
            <div
              v-for="item in mediaObject.large"
              :key="`${item.url}`"
              :class="$style.media"
              class="w-3/6 float-left"
            >
              <div class="relative mb-4 h-20">
                <a
                  :href="
                    item.youtubeId
                      ? `https://www.youtube.com/watch?v=${item.youtubeId}`
                      : item.url
                  "
                  class="text-xl font-bold no-underline border-none absolute"
                >
                  {{ item.title }}
                </a>
              </div>
              <div class="mt-4">
                <iframe
                  v-if="Boolean(item.youtubeId)"
                  :src="`https://www.youtube.com/embed/${item.youtubeId}`"
                  :frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                ></iframe>
                <a v-if="Boolean(item.img)" :href="item.sourceUrl">
                  <img
                    :src="require(`~/assets${item.img}`)"
                    :alt="`${item.title}`"
                  />
                </a>
              </div>
              <p class="mt-8 mb-8">
                Published on
                <a :href="item.sourceUrl">{{ item.sourceName }}</a> by
                {{ item.author }} <em>({{ item.date }})</em>.<a
                  v-if="Boolean(item.slides)"
                  :href="item.slides"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Slides.</a
                >
              </p>
            </div>
          </div>
          <Footer />
        </article>
      </div>

      <!-- /* Podcasts */ -->
      <div v-if="isPodcasts" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll nuxt-content">
          <h1 class="main-content-title">{{ title }}</h1>
          <div class="mb-14">
            <ul>
              <li v-for="item in mediaObject.small" :key="`${item.url}`">
                <a :href="`${item.sourceUrl}`">{{ item.title }}</a>
              </li>
            </ul>
          </div>
          <div :class="$style.mediaContainer">
            <div
              v-for="item in mediaObject.large"
              :key="`${item.url}`"
              :class="$style.media"
              class="w-3/6 float-left"
            >
              <div class="relative mb-4 h-20">
                <a
                  :href="
                    item.youtubeId
                      ? `https://www.youtube.com/watch?v=${item.youtubeId}`
                      : item.url
                  "
                  class="text-xl font-bold no-underline border-none absolute"
                >
                  {{ item.title }}
                </a>
              </div>
              <div class="mt-4">
                <iframe
                  v-if="Boolean(item.youtubeId)"
                  :src="`https://www.youtube.com/embed/${item.youtubeId}`"
                  :frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                ></iframe>
                <a v-if="Boolean(item.img)" :href="item.sourceUrl">
                  <img
                    :src="require(`~/assets${item.img}`)"
                    :alt="`${item.title}`"
                  />
                </a>
              </div>
              <p class="mt-8 mb-8">
                Published on
                <a :href="item.sourceUrl">{{ item.sourceName }}</a> by
                {{ item.author }} <em>({{ item.date }})</em>.
              </p>
            </div>
          </div>
          <Footer />
        </article>
      </div>

      <!-- /* Screencasts */ -->
      <div v-if="isScreencasts" class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll nuxt-content">
          <h1 class="main-content-title">{{ title }}</h1>
          <div class="mb-14">
            <ul>
              <li v-for="item in mediaObject.small" :key="`${item.url}`">
                <a :href="`${item.sourceUrl}`">{{ item.title }}</a>
              </li>
            </ul>
          </div>
          <div :class="$style.mediaContainer">
            <div
              v-for="item in mediaObject.large"
              :key="`${item.url}`"
              :class="$style.media"
              class="w-3/6 float-left"
            >
              <div class="relative mb-4 h-20">
                <a
                  :href="
                    item.youtubeId
                      ? `https://www.youtube.com/watch?v=${item.youtubeId}`
                      : item.url
                  "
                  class="text-xl font-bold no-underline border-none absolute"
                >
                  {{ item.title }}
                </a>
              </div>
              <div class="mt-4">
                <iframe
                  v-if="Boolean(item.youtubeId)"
                  :src="`https://www.youtube.com/embed/${item.youtubeId}`"
                  :frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                ></iframe>
                <a v-if="Boolean(item.img)" :href="item.sourceUrl">
                  <img
                    :src="require(`~/assets${item.img}`)"
                    :alt="`${item.title}`"
                  />
                </a>
              </div>
              <p class="mt-8 mb-8">
                Published on
                <a :href="item.sourceUrl">{{ item.sourceName }}</a> by
                {{ item.author }} <em>({{ item.date }})</em>.<a
                  v-if="Boolean(item.slides)"
                  :href="item.slides"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Slides.</a
                >
              </p>
            </div>
          </div>
          <Footer />
        </article>
      </div>

      <TableOfContents :toc="exampleItem.toc" :has-banner="Boolean(banner)" />
    </main>
  </div>
</template>

<style module>
.media:nth-child(odd) {
  clear: both;
}

.mediaContainer div:nth-child(odd) {
  @apply pr-8;
}
</style>
