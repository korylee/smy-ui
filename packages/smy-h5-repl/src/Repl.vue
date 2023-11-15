<template>
  <div class="vue-repl">
    <split-pane :layout="layout">
      <template #left>
        <editor-container :editor="editor" :theme="theme" />
      </template>
      <template #right>
        <code-output ref="outputRef" :editor="editor" :showCompileOutput="showCompileOutput" :theme="theme" />
      </template>
    </split-pane>
  </div>
</template>

<script>
import { ReplStore } from './store'
import EditorContainer from './editor/EditorContainer.vue'
import Output from './output/Output.vue'
import SplitPane from './SplitPane.vue'

export default {
  name: 'VueRepl',
  props: {
    store: {
      type: ReplStore,
      default: () => new ReplStore(),
    },
    editor: {
      type: String, // monaco || codemirror
      default: 'codemirror',
    },
    theme: {
      type: String,
      default: 'light',
    },
    showCompileOutput: {
      type: Boolean,
      default: true,
    },
    layout: String,
    previewOptions: {
      type: Object,
      default: () => ({
        headHTML: '',
        bodyHTML: '',
        customCode: {
          importCode: '',
          useCode: '',
        },
      }),
    },
  },
  components: { CodeOutput: Output, SplitPane, EditorContainer },
  provide() {
    const { store, previewOptions } = this
    return { store, previewOptions }
  },
  created() {
    const { store } = this
    store.init()
  },
}
</script>

<style scoped>
.vue-repl {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;

  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  margin: 0;
  overflow: hidden;
  background-color: var(--bg-soft);
}

.dark .vue-repl {
  --bg: #1a1a1a;
  --bg-soft: #242424;
  --border: #383838;
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}
</style>

<style>
button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
