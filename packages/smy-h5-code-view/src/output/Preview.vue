<script>
import { srcdoc } from './srcdocBase64'
import { PreviewProxy } from './PreviewProxy'

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
      proxy = new PreviewProxy(sandbox, {})
      sandbox.addEventListener('load', () => {
        proxy.handleLinks()
        updatePreview()
        // store.stateWatcher = updatePreview
      })
    }
    async function updatePreview() {
      console.log('--run--')
      const { state } = store
      try {
        const { mainFile } = state

        const codeToEval = [`window.__modules__ = {};\nwindow.__css__ = '';\n`]
        if (mainFile.endsWith('.vue')) {
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
