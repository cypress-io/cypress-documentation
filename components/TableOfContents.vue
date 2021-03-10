<template>
  <div class="hidden xl:block xl:col-span-2 mt-16">
    <nav
      v-if="toc.length"
      class="fixed w-sidebar top-16 bottom-0 right-0 pl-4 pr-8 pb-8 overflow-y-auto space-y-4 hide-scroll"
    >
      <h3 class="toc-heading">ON THIS PAGE</h3>
      <scrollactive
        :scroll-on-start="false"
        highlight-first-item
        active-class="scrollactive-item-active"
        :offset="96"
        tag="ul"
      >
        <li
          v-for="link of toc"
          :key="link.id"
          class="text-gray-400 dark:text-gray-300"
        >
          <a
            :href="`#${link.id}`"
            class="block text-sm scrollactive-item pl-1 transition-transform ease-in-out duration-300 transform hover:translate-x-1"
            :class="{
              'py-1': link.depth === 2,
              'ml-2 pb-2': link.depth === 3,
            }"
            >{{ link.text }}</a
          >
        </li>
      </scrollactive>
      <a href="#" class="text-blue text-sm"
        ><Icon name="long-arrow-alt-up" color="inherit" /> Back to Top</a
      >
    </nav>
  </div>
</template>

<script>
import Icon from './global/Icon'

export default {
  components: {
    Icon,
  },
  props: {
    toc: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
.toc {
  @apply pl-8;
  @apply pr-2;

  li {
    @apply list-none;
  }
}

.toc-heading {
  @apply mb-2;
  @apply pt-5;
  @apply text-gray-500;
  @apply uppercase;
  @apply tracking-wider;
  @apply font-bold;
  @apply text-xs;
}

.toc-nav {
  top: 0;
  height: calc(100vh - 35px);
  @apply py-4;
}

.scrollactive-nav {
  @apply mb-6;
  @apply pb-8;
}

.scrollactive-item-active {
  border-color: #04c38d;
  @apply text-gray-500;
  @apply font-bold;
  @apply border-l-4;
}
</style>
