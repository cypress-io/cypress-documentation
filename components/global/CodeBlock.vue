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
    <slot />
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
</style>
