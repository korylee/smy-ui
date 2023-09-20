import Vue from 'vue'
import { compileFile } from './compile'
import { atou } from './utils'
import { SFCScriptCompileOptions, SFCStyleCompileOptions, SFCTemplateCompileOptions } from '@vue/compiler-sfc'
import * as defaultCompiler from '@vue/compiler-sfc'

const DEFAULT_MAIN_FILE = 'App.vue'

const welcomeCode = `
<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
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
  vueServerRendererUrl: string
  resetFlip: boolean
}

export interface StoreOptions {
  serializedState?: string
  showOutput?: boolean
  outputMode?: string
  defaultVueRuntimeURL?: string
  //  defaultVueServerRendererURL is the default URL of the server renderer to use in the preview iframe zh:defaultVueServerRendererURL是在预览iframe中使用的服务器渲染器的默认URL
  defaultVueServerRendererURL?: string
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
  stateWatcher?: () => void

  private vm?: Vue
  private defaultVueRuntimeURL: string
  private defaultVueServerRendererURL: string
  private pendingCompiler: Promise<any> | null = null

  constructor({
    serializedState = '',
    defaultVueRuntimeURL = `https://unpkg.com/vue@2.6.14/dist/vue.esm.browser.min.js`,
    // defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@3.2.47/dist/runtime-dom.esm-browser.js`,
    defaultVueServerRendererURL = `https://unpkg.com/@vue/server-renderer@3.2.47/dist/server-renderer.esm-browser.js`,
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
        [DEFAULT_MAIN_FILE]: new CodeFile(DEFAULT_MAIN_FILE, welcomeCode),
      }
    }
    this.defaultVueRuntimeURL = defaultVueRuntimeURL
    this.defaultVueServerRendererURL = defaultVueServerRendererURL
    this.initialOutputMode = outputMode
    this.initialShowOutput = showOutput

    let mainFile = DEFAULT_MAIN_FILE
    if (!files[mainFile]) {
      mainFile = Object.keys(files)[0]
    }
    this.state = Vue.observable({
      mainFile,
      files,
      activeFile: files[mainFile],
      vueRuntimeUrl: defaultVueRuntimeURL,
      vueServerRendererUrl: defaultVueServerRendererURL,
      errors: [],
      resetFlip: true,
    })
    this.initImportMap()
  }

  init() {
    const self = this
    const { state } = self
    if (!this.vm) {
      this.vm = new Vue({
        data: () => ({ state }),
        watch: {
          state: {
            handler() {
              compileFile(self, state.activeFile)

              self.stateWatcher?.()
            },
            deep: true,
          },
        },
      })
    }

    for (const file in state.files) {
      if (file !== DEFAULT_MAIN_FILE) {
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
        if (!json.imports['vue/server-render']) {
          json.imports['vue/server-renderer'] = this.defaultVueServerRendererURL
          map.code = JSON.stringify(json, null, 2)
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  }

  getImportMap() {
    const { state } = this
    try {
      return JSON.parse(state.files['import-map.json'].code)
    } catch (e) {
      state.errors = [`Syntax error in import-map.json: ${(e as Error).message}`]
      return {}
    }
  }
}
