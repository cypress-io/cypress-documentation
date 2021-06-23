<template>
  <button
    ref="copy"
    :class="$style.copy"
    class="copy rounded-t-md rounded-b-md text-sm text-white font-normal relative flex flex-row"
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
