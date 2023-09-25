<template>
  <div class="editor-container">
    <FileSelector />
    <component class="editor" :is="editor" v-model="activeCode" :filename="activeFile.filename" :theme="theme" />
    <message :err="store.state.errors[0]" />
  </div>
</template>
<script>
import Message from '../Message.vue'
import Codemirror from './CodeMirrorEditor.vue'
import Monaco from './MonacoEditor.vue'
import FileSelector from './FileSelector.vue'

export default {
  inject: ['store'],
  props: {
    editor: [String, Object], // monaco || codemirror
    theme: String,
  },
  components: {
    Message,
    Codemirror,
    Monaco,
    FileSelector,
  },
  computed: {
    activeFile({ store }) {
      return store?.state.activeFile
    },
    activeCode: {
      get() {
        const { activeFile } = this
        return activeFile?.code || ''
      },
      set(code) {
        const { activeFile } = this
        if (!activeFile) return
        activeFile.code = code
      },
    },
  },
  methods: {},
}
</script>

<style scoped>
.editor-container {
  height: 100%;
  overflow: hidden;
  position: relative;
}
.editor {
  height: calc(100% - var(--header-height));
}
</style>
