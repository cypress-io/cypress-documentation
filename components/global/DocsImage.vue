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
    title: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    shadow: {
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
  <div :class="$style.docsImage">
    <img
      :class="[{ [$style.imageNoBorder]: noBorder }]"
      :src="filePath"
      :alt="alt || title || caption"
      :title="title"
    />
    <p v-if="caption" :class="$style.caption">
      {{ caption }}
    </p>
  </div>
</template>

<style module>
.docsImage {
  margin-bottom: 1rem;
}

.docsImage img {
  border: 1px solid #999 !important;
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.26) !important;
}

.imageNoBorder {
  border: none !important;
  box-shadow: none !important;
}

.caption {
  font-size: 0.85rem;
  text-align: center;
  margin-top: -0.5rem;
}
</style>
