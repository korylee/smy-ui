<template class="vue-repl">
  <div>
    <editor />
    <vue-output />
  </div>
</template>

<script>
import { ReplStore } from './store'
import Editor from './editor/Editor.vue'
import Output from './output/Output.vue'

export default {
  name: 'VueRepl',
  props: {
    store: {
      type: ReplStore,
      default: () => new ReplStore(),
    },
    editor: {
      type: String, // monaco || codemirror
      default: 'monaco',
    },
    ssr: Boolean,
  },
  components: { Editor, VueOutput: Output },
  provide() {
    const { store, editor } = this
    return { store, editor }
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

  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  margin: 0;
  overflow: hidden;
  background-color: var(--bg-soft);

  /* border: 1px solid var(--border);
  border-radius: 4px;*/
  /* transition: 0.3s linear border-color; */
  /* transition: box-shadow 0.2s ease-out;  */
}
</style>
