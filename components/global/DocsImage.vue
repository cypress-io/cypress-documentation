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
      default: false,
    },
  },
  computed: {
    filePath() {
      return require(`../../assets${this.src}`)
    },
  },
}
</script>

<template>
  <img
    :class="[$style.docsImage, { [$style.imageNoBorder]: noBorder }]"
    :src="filePath"
    :alt="alt"
  />
</template>

<style module>
.docsImage {
  margin-bottom: 1rem;
}
.imageNoBorder {
  border: none !important;
  box-shadow: none !important;
}
</style>
