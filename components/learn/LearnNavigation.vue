<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      lessonsCompleted: false,
    }
  },

  computed: {
    ...mapGetters({
      getterCurrentSection: 'learn/getterCurrentSection',
      getterLessonsData: 'learn/getterLessonsData',
    })
  },
}
</script>

<template>
  <div>
    <nav v-if="getterLessonsData" aria-label="Progress">
      <ol class="overflow-hidden">
        <!-- Testing Foundations -->
        <li class="relative">
          <div v-if="getterLessonsData['testing-foundations'].completed" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-600" aria-hidden="true"></div>
          <div v-else class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>

          <div class="relative flex items-center group" style="border-bottom: 0;">
            <!-- Complete Step -->
            <span v-if="getterLessonsData['testing-foundations'].completed" class="h-9 flex items-center">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                <icon name="check" color="white"></icon>
              </span>
            </span>

            <!-- Current Step -->
            <!-- <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
              </span>
            </span> -->

            <!-- Upcoming Step -->
            <span v-else class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>

            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ getterLessonsData['testing-foundations'].title }}</span>
              <span class="text-sm text-gray-500">{{ getterLessonsData['testing-foundations'].description }}</span>
            </span>
          </div>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in getterLessonsData['testing-foundations'].children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < getterLessonsData['testing-foundations'].children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <a :href="`/learn/${getterLessonsData['testing-foundations'].slug}/${section.slug}`" class="relative flex items-center group">

                  <!-- Completed Step -->
                  <span v-if="section.completed" class="h-9 flex items-center">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                      <icon name="check" color="white"></icon>
                    </span>
                  </span>

                  <!-- Current Step -->
                  <!-- <span class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                      <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
                    </span>
                  </span> -->

                  <!-- Upcoming Step -->
                  <span v-if="!section.completed" class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
                    </span>
                  </span>

                  <span class="ml-4 min-w-0 flex flex-col">
                    <span class="text-xs font-semibold tracking-wide uppercase text-gray-500">{{ section.title }}</span>
                    <!-- <span class="text-sm text-gray-500">{{ section.description }}</span> -->
                  </span>
                </a>
              </li>
            </ol>
          </nav>
        </li>

        <!-- Cypress Fundamentals -->
        <li class="relative">
          <div v-if="getterLessonsData['cypress-fundamentals'].completed" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-600" aria-hidden="true"></div>
          <div v-else class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>

          <div class="relative flex items-center group" style="border-bottom: 0;">
            <!-- Complete Step -->
            <span v-if="getterLessonsData['cypress-fundamentals'].completed" class="h-9 flex items-center">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                <icon name="check" color="white"></icon>
              </span>
            </span>

            <!-- Current Step -->
            <!-- <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
              </span>
            </span> -->

            <!-- Upcoming Step -->
            <span v-else class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>

            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ getterLessonsData['cypress-fundamentals'].title }}</span>
              <span class="text-sm text-gray-500">{{ getterLessonsData['cypress-fundamentals'].description }}</span>
            </span>
          </div>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in getterLessonsData['cypress-fundamentals'].children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < getterLessonsData['cypress-fundamentals'].children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <a :href="`/learn/${getterLessonsData['cypress-fundamentals'].slug}/${section.slug}`" class="relative flex items-center group">

                  <!-- Completed Step -->
                  <span v-if="section.completed" class="h-9 flex items-center">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                      <icon name="check" color="white"></icon>
                    </span>
                  </span>

                  <!-- Current Step -->
                  <!-- <span class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                      <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
                    </span>
                  </span> -->

                  <!-- Upcoming Step -->
                  <span v-if="!section.completed" class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
                    </span>
                  </span>

                  <span class="ml-4 min-w-0 flex flex-col">
                    <span class="text-xs font-semibold tracking-wide uppercase text-gray-500">{{ section.title }}</span>
                    <!-- <span class="text-sm text-gray-500">{{ section.description }}</span> -->
                  </span>
                </a>
              </li>
            </ol>
          </nav>
        </li>

        <!-- Testing Your First Application -->
        <li class="relative">
          <div v-if="getterLessonsData['testing-your-first-application'].completed" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-600" aria-hidden="true"></div>
          <div v-else class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>

          <div class="relative flex items-center group" style="border-bottom: 0;">
            <!-- Complete Step -->
            <span v-if="getterLessonsData['testing-your-first-application'].completed" class="h-9 flex items-center">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                <icon name="check" color="white"></icon>
              </span>
            </span>

            <!-- Current Step -->
            <!-- <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
              </span>
            </span> -->

            <!-- Upcoming Step -->
            <span v-else class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>

            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ getterLessonsData['testing-your-first-application'].title }}</span>
              <span class="text-sm text-gray-500">{{ getterLessonsData['testing-your-first-application'].description }}</span>
            </span>
          </div>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in getterLessonsData['testing-your-first-application'].children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < getterLessonsData['testing-your-first-application'].children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <a :href="`/learn/${getterLessonsData['testing-your-first-application'].slug}/${section.slug}`" class="relative flex items-center group">

                  <!-- Completed Step -->
                  <span v-if="section.completed" class="h-9 flex items-center">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                      <icon name="check" color="white"></icon>
                    </span>
                  </span>

                  <!-- Current Step -->
                  <!-- <span class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                      <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
                    </span>
                  </span> -->

                  <!-- Upcoming Step -->
                  <span v-if="!section.completed" class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
                    </span>
                  </span>

                  <span class="ml-4 min-w-0 flex flex-col">
                    <span class="text-xs font-semibold tracking-wide uppercase text-gray-500">{{ section.title }}</span>
                    <!-- <span class="text-sm text-gray-500">{{ section.description }}</span> -->
                  </span>
                </a>
              </li>
            </ol>
          </nav>
        </li>

        <!-- Real World Examples -->
        <li class="relative">
          <!-- <div v-if="getterLessonsData['real-world-examples'].completed" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-600" aria-hidden="true"></div> -->
          <!-- <div v-else class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div> -->

          <div class="relative flex items-center group" style="border-bottom: 0;">
            <!-- Complete Step -->
            <span v-if="getterLessonsData['real-world-examples'].completed" class="h-9 flex items-center">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                <icon name="check" color="white"></icon>
              </span>
            </span>

            <!-- Current Step -->
            <!-- <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
              </span>
            </span> -->

            <!-- Upcoming Step -->
            <span v-else class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>

            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ getterLessonsData['real-world-examples'].title }}</span>
              <span class="text-sm text-gray-500">{{ getterLessonsData['real-world-examples'].description }}</span>
            </span>
          </div>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in getterLessonsData['real-world-examples'].children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < getterLessonsData['real-world-examples'].children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <a :href="`/learn/${getterLessonsData['real-world-examples'].slug}/${section.slug}`" class="relative flex items-center group">

                  <!-- Completed Step -->
                  <span v-if="section.completed" class="h-9 flex items-center">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800">
                      <icon name="check" color="white"></icon>
                    </span>
                  </span>

                  <!-- Current Step -->
                  <!-- <span class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-600 rounded-full">
                      <span class="h-2.5 w-2.5 bg-gray-600 rounded-full"></span>
                    </span>
                  </span> -->

                  <!-- Upcoming Step -->
                  <span v-if="!section.completed" class="h-9 flex items-center" aria-hidden="true">
                    <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
                    </span>
                  </span>

                  <span class="ml-4 min-w-0 flex flex-col">
                    <span class="text-xs font-semibold tracking-wide uppercase text-gray-500">{{ section.title }}</span>
                    <!-- <span class="text-sm text-gray-500">{{ section.description }}</span> -->
                  </span>
                </a>
              </li>
            </ol>
          </nav>
        </li>
      </ol>
    </nav>
  </div>
</template>

<style scoped>
  ol.overflow-hidden {
    margin-left: 2rem;
  }
</style>