<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info',
      validator(value) {
        return ['info', 'tip', 'warning', 'danger'].includes(value) !== -1
      },
    },
  },
}
</script>

<template>
  <div :class="`alert is-${type}`" role="alert">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.alert {
  background-color: hsl(0, 0, 95%);
  border-color: rgb(0, 110, 255);
  @apply border-l-8;
  @apply p-5;
  @apply mb-5;

  &.is-tip {
    border-color: #42b983;
  }

  &.is-warning {
    border-color: #f4cd00;
  }

  &.is-danger {
    border-color: #f66;
  }

  h2 {
    @apply text-xl;
  }

  > :last-child {
    @apply mb-0;
  }
}
</style>
