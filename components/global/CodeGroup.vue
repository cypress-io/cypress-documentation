<template>
  <div ref="root" :class="$style.codeGroup">
    <div
      class="rounded-t-md mt-2 border-b-2 border-gray-700 px-2 bg-gray-800 text-sm text-white relative flex flex-row"
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
        class="px-4 py-3 text-gray-400 font-bold font-mono"
        :class="[$style.button, Math.min(0, activeTabIndex) === i && 'active']"
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
import { componentSync } from './componentSync'

export default {
  props: {
    syncGroup: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      codeBlocks: [],
      activeTabIndex: -1,
    }
  },
  watch: {
    activeTabIndex(newValue, oldValue) {
      this.activateCodeBlock(newValue)
    },
  },
  created() {
    componentSync.register(this, 'activateTab')
  },
  unmounted() {
    componentSync.unregister(this)
  },
  methods: {
    registerCodeBlock(codeBlock) {
      const { length } = this.codeBlocks

      if (length === 0) {
        this.$nextTick(this.updateHighlighteUnderlinePosition)
      }

      if (
        codeBlock.$vnode.componentInstance.active &&
        this.activeTabIndex === -1
      ) {
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
    activateTab(i) {
      this.activeTabIndex = i
    },
    updateTabs(i) {
      if (this.syncGroup) {
        componentSync.syncWithScroll(this, this.$refs.root, i)
      } else {
        this.activateTab(i)
      }
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
.button {
  outline: none !important;
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
