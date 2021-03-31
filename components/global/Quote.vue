<template>
  <blockquote>
    <p><slot></slot></p>
    <footer v-if="$scopedSlots.footer">
      <slot name="footer"></slot>
    </footer>
  </blockquote>
</template>

<style scoped lang="scss" >
blockquote {
  @apply bg-gray-50;
  @apply border-l-8;
  @apply p-5;
  @apply mb-5;

  border-color: #e5e7eb;

  p {
    @apply text-xl;
  }

  footer {
    @apply text-sm;
  }

  > :last-child {
    @apply mb-0;
  }
}
</style>
