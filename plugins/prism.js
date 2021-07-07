/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */
import 'clipboard'
import Prism from 'prismjs'
import Vue from 'vue'

// Include theme
import 'prism-themes/themes/prism-material-oceanic.css'

// Include language support
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

// Include the toolbar plugin
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/toolbar/prism-toolbar.css'

// Include the autolinker plugin
import 'prismjs/plugins/autolinker/prism-autolinker'
import 'prismjs/plugins/autolinker/prism-autolinker.css'

// Include the line highlight plugin
import 'prismjs/plugins/line-highlight/prism-line-highlight'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'

// Include the line numbers plugin
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// Include th copy to clipboard plugin
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'

// eslint-disable-next-line vue/component-definition-name-casing
Vue.component('prism', {
  props: {
    lang: {
      type: String,
      default: 'js'
    }
  },
  mounted () {
    Prism.highlightAll()
  },
  template: '<div class="prism"><pre class="line-numbers" :class="`language-${lang}`"><code><slot></slot></code></pre></div>'
})
