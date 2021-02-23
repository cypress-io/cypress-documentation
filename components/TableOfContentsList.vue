<script>
import Icon from './global/Icon'

export default {
  components: {
    Icon,
  },
  props: {
    toc: {
      /**
       * @type
       * {
       *   id: string,
       *   text: string,
       *   depth: number
       * }
       */
      type: Array,
      default: () => [],
    },
  },
  computed: {
    hasVariedDepth() {
      return this.toc.some((link) => link.depth === 3)
    },
  },
}
</script>

<template>
  <ul class="mb-8">
    <li v-for="link of toc" :key="link.id" class="py-2">
      <a
        :href="`#${link.id}`"
        :class="{
          'link-color': (hasVariedDepth && link.depth === 3) || !hasVariedDepth,
          'link-section-header': hasVariedDepth && link.depth === 2,
          'pl-2': !(hasVariedDepth && link.depth === 2),
          'py-2': link.depth === 2,
          'ml-2 pb-2': link.depth === 3,
        }"
        ><Icon
          v-if="(hasVariedDepth && link.depth === 3) || !hasVariedDepth"
          name="angle-right"
          color="inherit"
          class="mr-1"
        />{{ link.text }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
.link-color {
  @apply text-blue;
  @apply text-base;
}

.link-section-header {
  @apply block;
  @apply text-gray-500;
  @apply text-lg;
  @apply border-b;
  @apply border-gray-200;
}
</style>
