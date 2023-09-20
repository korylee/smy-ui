<template>
  <div class="editor">
    <div class="editor-container">
      <vue-codemirror :value="activeCode" @input="onChange" :options="cmOption" />
    </div>
  </div>
</template>
<script>
import VueCodemirror from '../codemirror/CodeMirror.vue'

// base style
import 'codemirror/lib/codemirror.css'

// theme css
import 'codemirror/theme/base16-dark.css'
// import 'codemirror/theme/monokai.css'

// language
import 'codemirror/mode/vue/vue.js'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

export default {
  name: 'VueEditor',
  inject: ['store'],
  components: {
    VueCodemirror,
  },
  computed: {
    cmOption: () => ({
      tabSize: 2,
      foldGutter: true,
      styleActiveLine: true,
      lineNumbers: true,
      line: true,
      keyMap: 'sublime',
      mode: 'text/x-vue',
      theme: 'base16-dark',
      extraKeys: {
        F11(cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'))
        },
        Esc(cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
        },
      },
    }),
    activeCode() {
      const { store } = this
      return store?.state.activeFile?.code || ''
    },
  },
  methods: {
    onChange(code) {
      const { store } = this
      if (!store) return
      store.state.activeFile.code = code
    },
  },
}
</script>

<style scoped>
.editor-container {
  overflow: hidden;
  position: relative;
}
</style>
