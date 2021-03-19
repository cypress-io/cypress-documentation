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
    title: {
      type: String,
      required: false,
      default: 'video',
    },
  },
  computed: {
    filePath() {
      return require(`../../assets${this.src}`)
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
  <EmbedVimeo v-if="isVimeo" :src="src" :title="title" />
  <EmbedYouTube v-else-if="isYouTube" :src="src" :title="title" />
  <video v-else class="docs-video" controls>
    <source :src="filePath" />
  </video>
</template>

<style lang="scss">
.docs-video {
  @apply mb-4;
}
</style>
