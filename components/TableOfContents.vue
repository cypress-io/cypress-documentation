<template>
  <div class="hidden xl:block xl:col-span-2 mt-16">
    <nav
      v-if="toc.length"
      class="fixed w-sidebar top-16 bottom-0 right-0 pl-4 pr-8 pb-8 overflow-y-auto space-y-4 hide-scroll"
    >
      <h3 :class="$style.tocHeading">ON THIS PAGE</h3>
      <scrollactive
        :scroll-on-start="false"
        highlight-first-item
        :active-class="$style.scrollactiveItemActive"
        :offset="100"
        tag="ul"
      >
        <li
          v-for="(link, index) of toc"
          :key="link.id"
          class="text-gray-500 dark:text-gray-300"
          :class="{
            'pt-4':
              link.depth === 2 && index !== 0 && toc[index - 1].depth === 3,
            'pb-1': link.depth === 2,
          }"
        >
          <a
            :href="`#${link.id}`"
            class="block text-sm scrollactive-item pl-1 hover:text-green transition-colors"
            :class="{
              'py-1 pb-2 pl-2 font-bold': link.depth === 2,
              'ml-4 py-1 pl-2 border-l-2 border-gray-200': link.depth === 3,
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

<style module>
.toc {
  @apply pl-8;
  @apply pr-2;
}

.toc li {
  @apply list-none;
}

.tocHeading {
  @apply mb-2;
  @apply pt-5;
  @apply text-gray-500;
  @apply uppercase;
  @apply tracking-wider;
  @apply font-bold;
  @apply text-xs;
}

.scrollactiveItemActive {
  border-color: #04c38d;
  @apply text-gray-500;
  @apply font-bold;
  @apply border-l-4;
}
</style>
