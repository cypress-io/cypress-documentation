<script>
export default {
  props: {
    alt: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      required: true,
    },
  },
  computed: {
    filePath() {
      return require(`../../assets${  this.src}`)
    },
  },
}
</script>

<template>
  <img class="docs-image" :src="filePath" :alt="alt" />
</template>

<style lang="scss">
.docs-image {
  margin-bottom: 1rem;
}
</style>
