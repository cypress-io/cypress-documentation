<script>
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
}
</script>

<template>
  <div>
    <nav aria-label="Progress">
      <ol class="overflow-hidden">
        <!-- Testing Foundations -->
        <li class="relative">
          <!-- <div class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-600" aria-hidden="true"></div> -->
          <div class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
          <!-- Complete Step -->
          <a href="#" class="relative flex items-start group" style="border-bottom: 0;">
            <!-- <span class="h-9 flex items-center"> -->
              <!-- <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full group-hover:bg-gray-800"> -->
                <!-- Heroicon name: solid/check -->
                <!-- <icon name="check" color="white"></icon> -->
              <!-- </span> -->
            <!-- </span> -->
            
            <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>
            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ learnNavData.foundations.title }}</span>
              <span class="text-sm text-gray-500">{{ learnNavData.foundations.description }}</span>
            </span>
          </a>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in learnNavData.foundations.children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < learnNavData.foundations.children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <!-- Upcoming Step -->
                <a href="#" class="relative flex items-start group">
                  <span class="h-9 flex items-center" aria-hidden="true">
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
          <div class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
          <!-- Complete Step -->
          <a href="#" class="relative flex items-start group" style="border-bottom: 0;">
            <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>
            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ learnNavData.fundamentals.title }}</span>
              <span class="text-sm text-gray-500">{{ learnNavData.fundamentals.description }}</span>
            </span>
          </a>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in learnNavData.fundamentals.children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < learnNavData.fundamentals.children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <!-- Upcoming Step -->
                <a href="#" class="relative flex items-start group">
                  <span class="h-9 flex items-center" aria-hidden="true">
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
          <div class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
          <!-- Complete Step -->
          <a href="#" class="relative flex items-start group" style="border-bottom: 0;">
            <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>
            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ learnNavData.testing.title }}</span>
              <span class="text-sm text-gray-500">{{ learnNavData.testing.description }}</span>
            </span>
          </a>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in learnNavData.testing.children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < learnNavData.testing.children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <!-- Upcoming Step -->
                <a href="#" class="relative flex items-start group">
                  <span class="h-9 flex items-center" aria-hidden="true">
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
          <!-- <div class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-600" aria-hidden="true"></div> -->
          <!-- Complete Step -->
          <a href="#" class="relative flex items-start group" style="border-bottom: 0;">
            <span class="h-9 flex items-center" aria-hidden="true">
              <span class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"></span>
              </span>
            </span>
            <span class="ml-4 min-w-0 flex flex-col">
              <span class="text-xs font-semibold tracking-wide uppercase">{{ learnNavData.examples.title }}</span>
              <span class="text-sm text-gray-500">{{ learnNavData.examples.description }}</span>
            </span>
          </a>

          <!-- Sections -->
          <nav aria-label="TestingFoundations" class="pt-5 pl-5">
            <ol class="overflow-hidden">
              <li v-for="(section, index) in learnNavData.examples.children" :key="index" class="relative pb-10">
                <div v-show="index + 1 < learnNavData.examples.children.length" class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true"></div>
                <!-- Upcoming Step -->
                <a href="#" class="relative flex items-start group">
                  <span class="h-9 flex items-center" aria-hidden="true">
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
