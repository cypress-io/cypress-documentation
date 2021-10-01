<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div :class="[active && 'active', $style.codeBlock]">
    <div v-if="true" :class="$style.alert">
      <slot name="alert"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<style module>
.codeBlock {
  display: none;
}

:global(.active) {
  display: block;
}

:global(.active .line-numbers) {
  @apply mt-0;
}

.alert {
  padding: 1em 1em 0;

  /* There doesn't seem to be any way to get this bg color from the prism theme */
  background: #263238;
}

.alert > div {
  margin-bottom: 0;
}

/* I couldn't figure out how to get the "alert" slot to conditionally display */
.alert:empty {
  display: none;
}
</style>
