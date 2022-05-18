<template>
  <nav class="flow-root" aria-label="Docs Guide Navigation">
    <router-link v-if="prev" class="nav-button float-left" :to="prev"> Prev </router-link>
    <router-link v-if="next" class="nav-button float-right" :to="next"> Next </router-link>
  </nav>
</template>

<script>
export default {
  props: {
    prev: {
      type: String,
      default: null,
      required: false,
    },
    next: {
      type: String,
      default: null,
      required: false,
    },
  },
}
</script>

<style scoped>
.nav-button {
  @apply items-center rounded-md py-2 px-4 bg-white text-base font-medium text-contrastGreen shadow-sm hover:bg-lightGreen hover:text-contrastGreen border border-lightGreen !important;
}
</style>
