<template>
  <div class="editor-container">
    <component :is="editor" v-model="activeCode" :filename="activeFile.filename" />
    <message :err="store.state.errors[0]" />
  </div>
</template>
<script>
import Message from '../Message.vue'
import Codemirror from './CodeMirrorEditor.vue'

export default {
  inject: ['store'],
  props: {
    editor: {
      type: [String, Object], // monaco || codemirror
      default: 'codemirror',
    },
  },
  components: {
    Message,
    Codemirror,
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
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
</style>
