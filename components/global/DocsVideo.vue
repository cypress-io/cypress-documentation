<script>
import EmbedVimeo from '../EmbedVimeo'
import EmbedYouTube from '../EmbedYouTube'

export default {
  components: {
    EmbedVimeo,
    EmbedYouTube,
  },
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  computed: {
    filePath() {
      return require('../../assets' + this.src)
    },
    isVimeo() {
      return this.src.includes('vimeo.com')
    },
    isYouTube() {
      return this.src.includes('youtube.com')
    },
  },
}
</script>

<template>
  <EmbedVimeo v-if="isVimeo" :src="src" />
  <EmbedYouTube v-else-if="isYouTube" :src="src" />
  <video v-else class="docs-video" controls>
    <source :src="filePath" />
  </video>
</template>

<style lang="scss">
.docs-video {
  @apply mb-4;
}
</style>
