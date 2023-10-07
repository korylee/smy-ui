<template>
  <div class="output-wrapper">
    <div class="tab-buttons">
      <button v-for="m of modes" :key="m" :class="{ active: mode === m }" class="tab-button" @click="mode = m">
        <span>{{ m }}</span>
      </button>
    </div>
    <div class="output-container">
      <preview :show="mode === 'preview'" />
      <component
        v-if="mode !== 'preview'"
        :is="editor"
        :mode="mode"
        readonly
        :value="activeFile.compiledResult[mode]"
        :filename="activeFile.filename"
        :theme="theme"
      />
    </div>
  </div>
</template>
<script>
import Preview from './Preview.vue'

export default {
  components: {
    Preview,
    Codemirror: () => import('../editor/CodeMirrorEditor.vue'),
    Monaco: () => import('../editor/MonacoEditor.vue'),
  },
  props: {
    editor: {
      type: [String, Object], // monaco || codemirror
      default: 'codemirror',
    },
    showCompileOutput: Boolean,
    theme: String,
  },
  inject: ['store'],
  data: (vm) => ({
    mode: 'preview',
  }),
  computed: {
    modes({ showCompileOutput }) {
      if (!showCompileOutput) {
        return ['preview']
      }
      return ['preview', 'js', 'css']
    },
    activeFile({ store }) {
      return store?.state.activeFile
    },
  },
}
</script>

<style scoped>
.output-wrapper {
  height: 100%;
  width: 100%;
}

.output-container {
  height: calc(100% - var(--header-height));
  overflow: hidden;
  position: relative;
}
.tab-buttons {
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  height: var(--header-height);
  overflow: hidden;
}
.tab-buttons button {
  padding: 0;
  box-sizing: border-box;
  border: none;
}

.tab-buttons button.active {
  color: var(--color-branding-dark);
  border-bottom: 3px solid var(--color-branding-dark);
}

.tab-buttons span {
  font-size: 13px;
  font-family: var(--font-code);
  text-transform: uppercase;
  color: var(--text-light);
  display: inline-block;
  padding: 8px 16px 6px;
  line-height: 20px;
}
</style>
