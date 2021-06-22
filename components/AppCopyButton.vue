<template>
  <button ref="copy" class="copy" data-test="copy-button">
    <Icon v-if="state === 'copied'" name="check-circle" color="green" data-test="copy-button-copied" />
    <Icon v-else name="paste" color="inherit" data-test="copy-button-default" class="w-5 h-5" />
  </button>
</template>

<script>
import Icon from './global/Icon'
import Clipboard from 'clipboard'

export default {
  components: {
    Icon,
  },
  data () {
    return {
      state: 'init'
    }
  },
  mounted () {
    const copyCode = new Clipboard(this.$refs.copy, {
      target (trigger) {
        return trigger.parentElement
      }    })

    copyCode.on('success', (event) => {
      event.clearSelection()
      this.state = 'copied'
      window.setTimeout(() => {
        this.state = 'init'
      }, 2000)
    })
  }
}
</script>