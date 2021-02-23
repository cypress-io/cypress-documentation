<script>
export default {
  props: {
    name: {
      type: [String, Array],
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'inherit',
    },
    className: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<template>
  <font-awesome-icon :icon="name" :class="className" :style="{ color }" />
</template>
