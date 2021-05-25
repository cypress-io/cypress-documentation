import Vue from 'vue'
import * as FullStory from '@fullstory/browser'

window.onNuxtReady(() => {
  if (process.env.CONTEXT === 'production') {
    FullStory.init({ orgId: process.env.FULLSTORY_ORG_ID })
    Vue.prototype.$FullStory = FullStory
  }
})
