<template>
  <button
    ref="copy"
    :class="$style.copy"
    class="copy absolute rounded-md text-xs text-white font-normal flex flex-row self-end items-center"
    data-test="copy-button"
  >
    <Icon :name="state === 'copied' ? 'check-circle' : 'paste'" color="white" />
    <span>{{ state === 'copied' ? 'Copied' : 'Copy' }}</span>
  </button>
</template>

<script>
import Icon from './global/Icon'
import Clipboard from 'clipboard'

export default {
  components: {
    Icon,
  },
  data() {
    return {
      state: 'init',
    }
  },
  mounted() {
    const copyCode = new Clipboard(this.$refs.copy, {
      target(trigger) {
        return trigger.parentElement
      },
    })

    copyCode.on('success', (event) => {
      event.clearSelection()
      this.state = 'copied'
      window.setTimeout(() => {
        this.state = 'init'
      }, 1500)
    })
  },
}
</script>

<style module>
.copy {
  right: 0.25rem;
  top: 0.25rem;
  border: 1px solid transparent;
  margin-left: 1rem;
  padding: 0.25rem 0.75rem;
  align-items: center;
}

.copy svg {
  margin-right: 0.5rem;
}

.copy:hover {
  border: 1px solid #ddd;
}
</style>
