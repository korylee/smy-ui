<script>
import { process } from './process'
import Message from '../Message.vue'
import srcdoc from './srcdoc.html?raw'
import { PreviewProxy } from './PreviewProxy/PreviewProxy'
import initPreviewDoc from './PreviewProxy/initPreview.js?raw'

export default {
  name: 'repl-preview',
  props: {
    show: Boolean,
  },
  components: { Message },
  inject: ['store', 'previewOptions'],
  data: () => ({
    runtimeError: '',
    runtimeWarning: '',
  }),
  created() {
    const { store, previewOptions } = this
    const self = this
    let sandbox
    let proxy

    this.$on('hook:mounted', createSandbox)

    function createSandbox() {
      const { container } = this.$refs
      if (sandbox) {
        proxy.destory()
        store.activeCodeWatcher = null
        container.removeChild(sandbox)
      }
      sandbox = document.createElement('iframe')
      sandbox.setAttribute(
        'sandbox',
        [
          'allow-forms',
          'allow-modals',
          'allow-pointer-lock',
          'allow-popups',
          'allow-same-origin',
          'allow-scripts',
          'allow-top-navigation-by-user-activation',
        ].join(' '),
      )

      const importMap = store.getImportMap()
      if (!importMap.imports) {
        importMap.imports = {}
      }
      if (!importMap.imports.vue) {
        importMap.imports.vue = store.state.vueRuntimeURL
      }
      const sandboxSrc = srcdoc
        .replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
        .replace(/<!-- PREVIEW-OPTIONS-HEAD-HTML -->/, previewOptions?.headHTML || '')
        .replace(/<!--INIT_PREVIEW-->/, initPreviewDoc)

      sandbox.srcdoc = sandboxSrc
      container.appendChild(sandbox)
      proxy = new PreviewProxy(sandbox, {
        console(log) {
          if (log.duplicate) {
            return
          }
          if (log.level === 'error') {
            const arg = log.args[0]
            self.runtimeError = arg instanceof Error ? arg.message : arg
          } else if (log.level === 'warn') {
            self.runtimeWarning = log.args.join('').trim()
          }
        },
        error(event) {
          const msg = Error(event.value).message

          if (msg.includes('Failed to resolve module specifier') || msg.includes('Error resolving module specifier')) {
            self.runtimeError =
              msg.replace(/\. Relative references must.*$/, '') +
              `.\nTip: edit the "Import Map" tab to specify import paths for dependencies.`
          } else {
            self.runtimeError = event.value
          }
        },
        unhandledrejection(event) {
          let error = event.value
          if (typeof error === 'string') {
            error = { message: error }
          }
          self.runtimeError = 'Uncaugth (in primose): ' + error.message
        },
      })
      sandbox.addEventListener('load', () => {
        proxy.handleLinks()
        updatePreview()
        store.activeCodeWatcher = updatePreview
      })
    }
    async function updatePreview() {
      self.runtimeError = null
      self.runtimeWarning = null
      const { state } = store
      try {
        const { mainFile } = state
        const modules = process(store)
        console.log(`[@smy-h5/repl] successfully compiled ${modules.length} module${modules.length > 1 ? `s` : ``}.`)
        const codeToEval = [
          `
        window.__modules__ = {};
        window.__css__ = '';
        window.__app__ && window.__app__.$destroy();
        document.body.innerHTML = '<div id="app"></div>' + \`${previewOptions?.bodyHTML || ''}\`;
        `,
          ...modules,
          `document.getElementById('__sfc-styles').innerHTML = window.__css__`,
        ]
        if (mainFile.endsWith('.vue')) {
          codeToEval.push(
            `import Vue from 'vue'
            ${previewOptions?.customCode?.importCode || ''}
            Vue.config.errorHandler = (e) => (console.error(e));

            const _mount = () => {
              const AppComponent = __modules__["${mainFile}"].default
              const app = window.__app__ = new Vue({ render: (h) => h(AppComponent) })
              ${previewOptions?.customCode?.useCode || ''}
              app.$mount('#app');
            }
            _mount()`,
          )
        }

        await proxy.eval(codeToEval)
      } catch (error) {
        console.error(error)
        self.runtimeError = error.message
      }
    }
    console.log(store)
  },
  methods: {},
}
</script>

<template>
  <div class="iframe-wrapper" v-show="show">
    <div class="iframe-container" ref="container"></div>
    <Message :err="runtimeError" />
    <Message v-if="!runtimeError" :warn="runtimeWarning" />
  </div>
</template>

<style scoped>
.iframe-wrapper,
.iframe-container,
.iframe-container /deep/ iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.iframe-container {
  background-color: #fff;
}
.iframe-wrapper {
  height: 100%;
}
</style>
