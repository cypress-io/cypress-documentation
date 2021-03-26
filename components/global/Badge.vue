<template>
  <div :class="['badge', `badge-${type}`]">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.badge {
  display: inline-block;
  color: #fff;
  font-size: 0.7rem;
  border-radius: 10rem;
  font-weight: 700;
  padding: 0.25em 0.4em;
  line-height: 0.7rem;
  @apply px-2;
  @apply py-1;
}

.badge-success {
  background-color: #28a745;
}

.badge-danger {
  background-color: #dc3545;
}

.badge-info {
  background-color: #007bff;
}
</style>
