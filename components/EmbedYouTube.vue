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
}
</script>

<template>
  <EmbedContainer>
    <iframe
      :src="src"
      :title="title"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    ></iframe>
  </EmbedContainer>
</template>
