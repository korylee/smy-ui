import { ReplStore } from '../../store'
import { editor, languages, Uri } from 'monaco-editor-core'
import * as langConfigs from './lang-configs'
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

  initted = true
}

export function loadMonacoEnv(store: ReplStore) {
  ;(self as any).MonacoEnvironment = {
    async getWorker(_: any, label: string) {
      if (label === 'json') {
        return new jsonWorker()
      }
      switch (label) {
        case 'json':
          return new jsonWorker()
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
          return new cssWorker()
        case 'html':
        case 'razor':
          return new htmlWorker()
        case 'typescript':
        case 'javascript':
          return new tsWorker()
        default:
          return new editorWorker()
      }
    },
  }
  languages.register({ id: 'vue', extensions: ['.vue'] })
  languages.register({ id: 'javascript', extensions: ['.js'] })
  languages.register({ id: 'typescript', extensions: ['.ts'] })
  languages.register({ id: 'css', extensions: ['.css'] })
  languages.register({ id: 'less', extensions: ['.less'] })
  languages.register({ id: 'scss', extensions: ['.scss'] })

  languages.setLanguageConfiguration('vue', langConfigs.vue)
  languages.setLanguageConfiguration('javascript', langConfigs.js)
  languages.setLanguageConfiguration('typescript', langConfigs.ts)
  languages.setLanguageConfiguration('css', langConfigs.css)

  editor.registerEditorOpener({
    openCodeEditor(_, resource) {
      const path = resource.path
      if (/^\//.test(path)) {
        const filename = path.replace('/', '')
        if (filename !== store.state.activeFile.filename) {
          store.setActive(filename)
          return true
        }
      }
      return false
    },
  })
}
