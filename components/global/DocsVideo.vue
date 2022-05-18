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
  <video v-else :class="$style.docsVideo" :title="title" controls>
    <source :src="filePath" />
  </video>
</template>

<style module>
.docsVideo {
  @apply mb-4;
}
/* stylelint-disable-next-line at-rule-no-unknown */
@screen xl {
  .docsVideo {
    min-height: 380px;
  }
}
</style>
