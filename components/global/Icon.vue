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
  computed:{
    realName(){
      // since github is a branding image,
      // we needs to precise a prefix for it
      return this.name === 'github' ? ['fab', 'github'] : this.name
    }
  }
}
</script>

<template>
  <font-awesome-icon :icon="realName" :class="className" :style="{ color }" />
</template>
