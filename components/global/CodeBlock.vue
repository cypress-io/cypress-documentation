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
  data() {
    return {
      activeState: this.active,
    }
  },
  beforeMount() {
    if (this.$parent && this.$parent.registerCodeBlock) {
      this.$parent.registerCodeBlock(this)
    }
  },
  methods: {
    setActiveState(state) {
      this.activeState = state
    },
  },
}
</script>

<template>
  <div :class="[activeState && $style.active, $style.codeBlock]">
    <div v-if="true" :class="['code-block', $style.alert]">
      <slot name="alert"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<style module>
.codeBlock {
  display: none;
}

.active {
  display: block;
}

.active .line-numbers {
  @apply mt-0;
}

.alert {
  padding: 1em 1em 0;

  /* There doesn't seem to be any way to get this bg color from the prism theme */
  background: #263238;
}

/* I couldn't figure out how to get the "alert" slot to conditionally display */
.alert:empty {
  display: none;
}
</style>
