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
import { mapGetters, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        currentLearnSection: null,
      }
    },

    computed: {
      ...mapGetters({
        getterCurrentSection: 'learn/getterCurrentSection',
        getterLessonsData: 'learn/getterLessonsData',
      }),
    },

    methods: {
      ...mapMutations({
        updateCurrentLesson: 'learn/updateCurrentLesson',
        updateLessonsData: 'learn/updateLessonsData',
      }),

      completeLesson(index) {
        let lessonsDataCopy = this.getterLessonsData

        lessonsDataCopy[this.getterCurrentSection].children[index].completed = true
        this.updateLessonsData(lessonsDataCopy)
      },

      completeSection() {
        let lessonsDataCopy = this.getterLessonsData
        let completedLessons = lessonsDataCopy[this.getterCurrentSection].children.filter(lesson => lesson.completed === true)

        if (completedLessons.length === lessonsDataCopy[this.getterCurrentSection].children.length) {
          lessonsDataCopy[this.getterCurrentSection].completed = true
          this.updateLessonsData(lessonsDataCopy)
        }
      },

      goToNextLesson() {
        let currentRouteSlug = this.$route.path.split("/").pop()


        this.updateCurrentLesson(this.$route.path)

        this.getterLessonsData[this.getterCurrentSection].children.forEach((lesson, index) => {
          // After the final lesson, go back to /learn/index
          if (lesson.slug === currentRouteSlug && index === this.getterLessonsData[this.getterCurrentSection].children.length - 1) {
            this.completeLesson(index)
            this.completeSection()
            this.$router.push('/learn/index')

            return
          }

          if (lesson.slug === currentRouteSlug) {
            this.completeLesson(index)
            this.$router.push(`/learn/${this.getterCurrentSection}/${this.getterLessonsData[this.getterCurrentSection].children[index + 1].slug}`)
          }
        })
      }
    }
  }
</script>