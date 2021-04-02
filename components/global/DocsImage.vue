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
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    filePath() {
      return require(`../../assets${this.src}`)
    },
  },
}
</script>

<template>
  <img class="docs-image" :class="{'image-no-border': noBorder}" :src="filePath" :alt="alt" />
</template>

<style lang="scss">
.docs-image {
  margin-bottom: 1rem;
}
.image-no-border {
  border: none !important;
  box-shadow: none !important;
}
</style>
