<script>
import EmbedContainer from './EmbedContainer'

export default {
  components: {
    EmbedContainer,
  },
  props: {
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    videoId() {
      const idStartIndex = this.src.lastIndexOf('/') + 1

      return this.src.slice(idStartIndex)
    },
  },
}
</script>

<template>
  <EmbedContainer>
    <iframe
      :src="`https://player.vimeo.com/video/${videoId}`"
      :title="title"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    ></iframe>
  </EmbedContainer>
</template>
