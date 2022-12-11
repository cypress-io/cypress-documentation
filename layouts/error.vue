<script>
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'
import { algolia } from '../content/settings.json'

export default {
  components: {
    AppHeader,
    Footer,
  },
  data() {
    return {
      algoliaSettings: algolia,
    }
  },
  head() {
    return {
      title: '404 | Cypress Documentation',
    }
  },
}
</script>

<template>
  <div class="w-full">
    <AppHeader
      :mobile-menu-items="[]"
      section="guides"
      :algolia-settings="algoliaSettings"
    />
    <main class="">
      <div class="main-content-article-wrapper">
        <article class="main-content-article hide-scroll">
          <h1 class="main-content-header text-center">404 Page Not Found</h1>
          <div class="nuxt-content">
            <div class="mb-8">
              <p class="text-center">
                Well darn&hellip; we can't find the page you're looking for. One
                of these links might help.
              </p>
            </div>
            <div class="mb-8 flex flex justify-around items-center">
              <ul>
                <li class="list-none">
                  <Icon name="angle-right" class="mr-2"></Icon
                  ><a href="/guides/core-concepts/introduction-to-cypress"
                    >Introduction to Cypress</a
                  >
                </li>
                <li class="list-none">
                  <Icon name="angle-right" class="mr-2"></Icon
                  ><a href="/api/table-of-contents">The API docs</a>
                </li>
                <li class="list-none">
                  <Icon name="angle-right" class="mr-2"></Icon
                  ><a href="/examples/examples/tutorials">Tutorials</a>
                </li>
                <li class="list-none">
                  <Icon name="angle-right" class="mr-2"></Icon
                  ><a href="https://www.cypress.io/dashboard/"
                    >Cypress Cloud</a
                  >
                </li>
              </ul>
            </div>
            <div class="mb-8">
              <p class="italic text-center">
                Try using our sweet custom search in the header above
                <Icon name="search"></Icon>
              </p>
            </div>
          </div>
          <Footer />
        </article>
      </div>
    </main>
  </div>
</template>
