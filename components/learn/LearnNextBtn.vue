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
import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        currentLearnSection: null,
        learnNavData: null,
      }
    },
    async fetch() {
      const data = await this.$content('_data/learn').fetch()

      this.learnNavData = data
    },
    
    computed: {
      ...mapGetters({
        getterCurrentSection: 'learn/getterCurrentSection',
      }),
    },

    methods: {
      goToNextLesson() {
        let currentRouteSlug = this.$route.path.split("/").pop()
        
        this.learnNavData[this.getterCurrentSection].children.forEach((lesson, index) => {
          // After the final lesson, go back to /learn/index
          if (lesson.slug === currentRouteSlug && index === this.learnNavData[this.getterCurrentSection].children.length - 1) {
            this.$router.push('/learn/index')

            return
          }

          if (lesson.slug === currentRouteSlug) {
            this.$router.push(`/learn/${this.getterCurrentSection}/${this.learnNavData[this.getterCurrentSection].children[index + 1].slug}`)
          }
        })
      }
    }
  }
</script>