<script>
import { srcdoc } from './srcdocBase64'
import { PreviewProxy } from './PreviewProxy'
import { process } from './process'

export default {
  name: 'VuePreview',
  props: {
    show: Boolean,
    ssr: Boolean,
  },
  inject: ['store'],
  created() {
    const { store } = this
    const self = this
    let sandbox
    let proxy

    this.$on('hook:mounted', createSandbox)

    function createSandbox() {
      const { container } = this.$refs
      if (sandbox) {
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
        ].join(' ')
      )

      const importMap = store.getImportMap()
      if (!importMap.imports) {
        importMap.imports = {}
      }
      if (!importMap.imports.vue) {
        importMap.imports.vue = store.state.vueRuntimeURL
      }
      const sandboxSrc = srcdoc.replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
      sandbox.srcdoc = sandboxSrc
      container.appendChild(sandbox)
      proxy = new PreviewProxy(sandbox, {
        console(log) {
          if (log.duplicate) {
            return
          }
          if (log.level === 'error') {
          }
        },
      })
      sandbox.addEventListener('load', () => {
        proxy.handleLinks()
        updatePreview()
        store.activeCodeWatcher = updatePreview
      })
    }
    async function updatePreview() {
      const { state } = store
      try {
        const { mainFile } = state
        const modules = process(store)
        console.log(
          `[@smy-h5/code-view] successfully compiled ${modules.length} module${modules.length > 1 ? `s` : ``}.`
        )
        const codeToEval = [
          `
        window.__modules__ = {};
        window.__css__ = '';
        window.__app__ && window.__app__.$destroy();
        document.body.innerHTML = '<div id="app"></div>';
        `,
          ...modules,
          `document.getElementById('__sfc-styles').innerHTML = window.__css__`,
        ]
        if (mainFile.endsWith('.vue')) {
          codeToEval.push(`
          import Vue from 'vue'
          const _mount = () => {
            const AppComponent = __modules__["${mainFile}"].default
            const app = window.__app__ = new Vue({ render: (h) => h(AppComponent) })
            app.$mount('#app');
          }
          _mount()
          `)
        }
        await proxy.eval(codeToEval)
      } catch (error) {}
    }
    console.log(store)
  },
  methods: {},
}
</script>

<template>
  <div class="iframe-wrapper" v-show="show">
    <div class="iframe-container" ref="container"></div>
    <!-- <Message :err="runtimeError" />
    <Message v-if="!runtimeError" :warn="runtimeWarning" /> -->
  </div>
</template>
