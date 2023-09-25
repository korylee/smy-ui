import { ReplStore } from '../../store'
import { editor, languages, Uri } from 'monaco-editor-core'
import * as onigasm from 'onigasm'
// @ts-ignore
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url'
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

let initted = false
export function initMonaco(store: ReplStore) {
  if (initted) return
  loadMonacoEnv(store)
  loadWasm()

  initted = true
}

export function loadWasm() {
  return onigasm.loadWASM(onigasmWasm)
}

export function loadMonacoEnv(store: ReplStore) {
  ;(self as any).MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      if (label === 'json') {
        return new jsonWorker()
      }
      switch (label) {
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
          return cssWorker()
        case 'html':
        case 'razor':
          return new htmlWorker()
        case 'typescript':
        case 'javascript':
          return tsWorker()
        default:
          return new editorWorker()
      }
    },
  }
  languages.register({ id: 'vue', extensions: ['.vue'] })
  languages.register({ id: 'javascript', extensions: ['.js'] })
  languages.register({ id: 'typescript', extensions: ['.ts'] })
}
