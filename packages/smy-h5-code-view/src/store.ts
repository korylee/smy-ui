import Vue from 'vue'
import { compileFile } from './compile'
import { atou } from './utils'
import { SFCScriptCompileOptions, SFCStyleCompileOptions, SFCTemplateCompileOptions } from '@vue/compiler-sfc'
import * as defaultCompiler from '@vue/compiler-sfc'

const DefaultMainFile = 'App.vue'
export const ImportMapFile = 'import-map.json'

const welcomeCode = `
<template>
  <div>
    <h1>{{ msg }}</h1>
    <input v-model="msg">
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: 'Hello World!',
    };
  },
};
</script>
`.trim()

export class CodeFile {
  compiledResult = {
    css: '',
    js: '',
    ssr: '',
  }

  constructor(public filename: string, public code = '', public hidden = false) {}
}

export interface StoreState {
  mainFile: string
  files: Record<string, CodeFile>
  activeFile: CodeFile
  errors: (string | Error)[]
  vueRuntimeUrl: string
  resetFlip: boolean
}

export interface StoreOptions {
  serializedState?: string
  showOutput?: boolean
  outputMode?: string
  defaultVueRuntimeURL?: string
}

export interface SFCOptions {
  script?: Omit<SFCScriptCompileOptions, 'id'>
  style?: SFCStyleCompileOptions
  template?: SFCTemplateCompileOptions
}

export class ReplStore {
  state: StoreState
  compiler = defaultCompiler
  vueVersion?: string
  options?: SFCOptions
  initialShowOutput: boolean
  initialOutputMode: string
  activeCodeWatcher?: () => void

  private vm?: Vue
  private defaultVueRuntimeURL: string
  private pendingCompiler: Promise<any> | null = null

  constructor({
    serializedState = '',
    defaultVueRuntimeURL = `https://unpkg.com/vue@2.6.14/dist/vue.esm.browser.min.js`,
    showOutput = false,
    outputMode = 'preview',
  }: StoreOptions = {}) {
    let files: StoreState['files'] = {}

    if (serializedState) {
      const saved = JSON.parse(atou(serializedState))
      for (const filename in saved) {
        files[filename] = new CodeFile(filename, saved[filename])
      }
    } else {
      files = {
        [DefaultMainFile]: new CodeFile(DefaultMainFile, welcomeCode),
      }
    }
    this.defaultVueRuntimeURL = defaultVueRuntimeURL
    this.initialOutputMode = outputMode
    this.initialShowOutput = showOutput

    let mainFile = DefaultMainFile
    if (!files[mainFile]) {
      mainFile = Object.keys(files)[0]
    }
    this.state = Vue.observable({
      mainFile,
      files,
      activeFile: files[mainFile],
      vueRuntimeUrl: defaultVueRuntimeURL,
      errors: [],
      resetFlip: true,
    })
    this.initImportMap()
  }

  init() {
    const self = this
    const { state } = self
    this.vm = new Vue({
      data: () => ({ state }),
      watch: {
        'state.activeFile.code': {
          handler() {
            compileFile(self, state.activeFile).then(() => {
              self.activeCodeWatcher?.()
            })
          },
          immediate: true,
        },
      },
    })

    for (const file in state.files) {
      if (file !== DefaultMainFile) {
        compileFile(this, state.files[file])
      }
    }
  }

  private initImportMap() {
    const { state } = this
    const importMapJsonName = 'import-map.json'
    const map = state.files[importMapJsonName]
    if (!map) {
      state.files['import-map.json'] = new CodeFile(
        importMapJsonName,
        JSON.stringify(
          {
            imports: { vue: this.defaultVueRuntimeURL },
          },
          null,
          2
        )
      )
    } else {
      try {
        const json = JSON.parse(map.code)
        if (!json.imports.vue) {
          json.imports.vue = this.defaultVueRuntimeURL
          map.code = JSON.stringify(json, null, 2)
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  }

  getImportMap() {
    const { state } = this
    try {
      return JSON.parse(state.files[ImportMapFile].code)
    } catch (e) {
      state.errors = [`Syntax error in ${ImportMapFile}: ${(e as Error).message}`]
      return {}
    }
  }

  setImportMap(map: { imports: Record<string, string>; scopes?: Record<string, Record<string, string>> }) {
    this.state.files[ImportMapFile].code = JSON.stringify(map, null, 2)
  }
}
