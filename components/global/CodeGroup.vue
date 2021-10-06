<template>
  <div :class="$style.codeGroup">
    <div
      class="rounded-t-md border-b-2 border-gray-700 px-2 bg-gray-800 text-sm text-white relative flex flex-row"
    >
      <button
        v-for="(
          {
            $vnode: {
              componentInstance: { label },
            },
          },
          i
        ) in codeBlocks"
        ref="tabs"
        :key="label"
        class="px-4 py-3 text-gray-400 font-bold font-mono outline-none"
        :class="[activeTabIndex === i && 'active']"
        @click="updateTabs(i)"
      >
        {{ label }}
      </button>
      <button
        v-if="codeBlocks.length === 0"
        class="px-4 py-3 text-gray-400 font-bold font-mono"
      >
        Loading...
      </button>
      <span ref="highlightUnderline" :class="$style.highlightUnderline" />
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      codeBlocks: [],
      activeTabIndex: 0,
    }
  },
  watch: {
    activeTabIndex(newValue, oldValue) {
      this.activateCodeBlock(newValue)
    },
  },
  methods: {
    registerCodeBlock(codeBlock) {
      const { length } = this.codeBlocks

      if (length === 0) {
        this.$nextTick(this.updateHighlighteUnderlinePosition)
      }

      if (codeBlock.$vnode.componentInstance.active) {
        this.activeTabIndex = length
      }

      this.codeBlocks.push(codeBlock)
    },
    activateCodeBlock(index) {
      this.codeBlocks.forEach((codeBlock, i) => {
        codeBlock.setActiveState(i === index)
      })

      this.updateHighlighteUnderlinePosition()
    },
    updateTabs(i) {
      this.activeTabIndex = i
    },
    updateHighlighteUnderlinePosition() {
      if (!this.$refs.tabs) {
        return
      }

      const activeTab = this.$refs.tabs[this.activeTabIndex]
      const { highlightUnderline } = this.$refs

      highlightUnderline.style.left = `${activeTab.offsetLeft}px`
      highlightUnderline.style.width = `${activeTab.clientWidth}px`
    },
  },
}
</script>

<style module>
button {
  outline: none;
}

.highlightUnderline {
  bottom: -2px;
  height: 2px;
  transition: left 150ms, width 150ms;
  background-color: #00cd81;

  @apply absolute;
}

/**
 * Since this code is going to be in the 
 * code block it will have another scope,
 * we need to avoid scoping it 
 */
.codeGroup pre[class*='language-'] {
  @apply rounded-t-none;
  @apply mt-0;
}
</style>
