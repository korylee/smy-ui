<script>
import * as monaco from 'monaco-editor-core'
import { loadGrammars, loadTheme } from 'monaco-volar'
import { getOrCreateModel } from './utils'
import { initMonaco } from './env'

const props = {
  value: String,
  filename: String,
  readonly: Boolean,
  mode: String, // 'js' | 'css'
  theme: String,
}

export default {
  props,
  inject: ['store'],
  computed: {
    lang({ mode }) {
      return mode === 'css' ? 'css' : 'javascript'
    },
  },
  watch: {},
  created() {
    initMonaco(this.store)
  },
  async mounted() {
    const theme = await loadTheme(monaco.editor)
    await this.$nextTick()
    const { container } = this.$refs
    if (!container) {
      throw new Error('Cannot find container')
    }
    const { readonly, value, lang, theme: curTheme } = this
    const editorInstance = monaco.editor.create(container, {
      ...(readonly ? { value, language: lang } : { model: null }),
      fontSize: 13,
      theme: curTheme === 'light' ? theme.light : theme.dark,
      readOnly: readonly,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false,
      },
      inlineSuggest: {
        enabled: false,
      },
      'semanticHighlighting.enabled': true,
      fixedOverflowWidgets: true,
    })

    this.editor = editorInstance

    const t = editorInstance._themeService._theme
    t.getTokenStyleMetadata = (type, modifiers, _language) => {
      const _readonly = modifiers.includes('readonly')
      switch (type) {
        case 'function':
        case 'method':
          return { foreground: 12 }
        case 'class':
          return { foreground: 11 }
        case 'variable':
        case 'property':
          return { foreground: _readonly ? 21 : 9 }
        default:
          return { foreground: 0 }
      }
    }
    this.$watch(
      'value',
      (value) => {
        if (editorInstance.getValue() === value) return
        editorInstance.setValue(value || '')
      },
      { immediate: true },
    )
    this.$watch('lang', (lang) => {
      monaco.editor.setModelLanguage(editorInstance.getModel(), lang)
    })
    if (!readonly) {
      this.$watch(
        'filename',
        (filename, oldFilename) => {
          const { store, editor, readonly } = this
          if (readonly || !editorInstance) {
            return
          }
          const file = store.state.files[filename]
          if (!file) return null
          const model = getOrCreateModel(monaco.Uri.parse(`file:///${filename}`), file.language, file.code)
          const oldFile = oldFilename ? store.state.files[oldFilename] : null
          if (oldFile) {
            oldFile.editorViewState = editorInstance.saveViewState()
          }
          editorInstance.setModel(model)
          if (file.editorViewState) {
            editorInstance.restoreViewState(file.editorViewState)
            editorInstance.focus()
          }
        },
        {
          immediate: true,
        },
      )
    }

    await loadGrammars(monaco, editorInstance)

    editorInstance.onDidChangeModelContent(() => {
      this.$emit('input', editorInstance.getValue())
    })
  },
  methods: {},
}
</script>

<template>
  <div ref="container" class="editor"></div>
</template>

<style>
.editor {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
