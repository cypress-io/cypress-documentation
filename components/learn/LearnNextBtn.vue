<template>
  <div>
    <button
      v-if="this.$route.path !== '/learn/index'"
      type="button" 
      class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
      @click="goToNextLesson"
    >
      Go To Next Lesson
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

  export default {
    data() {
      return {
        learnNavData: null,
      }
    },
    async fetch() {
      const data = await this.$content('_data/learn').fetch()

      this.learnNavData = data
    },

    mounted() {
      this.$nextTick(() => {
        this.updateCurrentLesson(this.$route.path)
      })
    },

    methods: {
      ...mapMutations({
        updateCurrentLesson: 'learn/updateCurrentLesson'
      }),

      goToNextLesson() {
        let currentRouteSlug = this.$route.path.split("/").pop()

        this.learnNavData.foundations.children.forEach((lesson, index) => {
          // After the final lesson, go back to /learn/index
          if (lesson.slug === currentRouteSlug && index === this.learnNavData.foundations.children.length - 1) {
            this.$router.push('/learn/index')

            return
          }

          if (lesson.slug === currentRouteSlug) {
            this.$router.push(`/learn/testing-foundations/${this.learnNavData.foundations.children[index + 1].slug}`)
          }
        })
      }
    }
  }
</script>