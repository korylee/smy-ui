<template>
  <div class="container">
    <repl :store="store" :previewOptions="previewOptions"></repl>
  </div>
</template>

<script>
import { Repl, ReplStore } from '@smy-h5/code-view'
import '@smy-h5/code-view/style.css'

// const savedPreferDark = localStorage.getItem('smy-ui-playground-prefer-dark')
// if (savedPreferDark === 'true' || (!savedPreferDark && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
//   document.documentElement.classList.add('dark')
// }

const store = new ReplStore({
  serializedState: location.hash.slice(1),
})

store.setImportMap({
  imports: {
    ...store.getImportMap().imports,
    '@smy-h5/ui': './smy.esm.js',
  },
})

function setVH() {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`)
}

window.addEventListener('resize', setVH)
setVH()

export default {
  components: { Repl },
  data: () => ({
    store,
  }),
  computed: {
    previewOptions() {
      return {
        // eslint-disable-next-line no-useless-escape
        headHTML: `<script src="./smy-touch-emulator.js"><\/script>
        <link rel="stylesheet" href="./smy.css"></link>
        <style>
        body {
          min-height: 100vh;
          padding: 16px;
          margin: 0;
          color: var(--color-text);
          background-color: var(--color-body);
        }
        *::-webkit-scrollbar {
          display: none;
        }
        </style>`,
        customCode: {
          importCode: `import SmyUi from '@smy-h5/ui'`,
          useCode: `Vue.use(SmyUi)`,
        },
      }
    },
  },
  mounted() {},
  methods: {},
}
</script>

<style>
*::-webkit-scrollbar {
  display: none;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  margin: 0;

  --base: #444;

  color: var(--color-text);
}

.vue-repl {
  --color-branding: #5580f8 !important;
  --color-branding-dark: #5580f8 !important;

  height: var(--vh);
}
</style>
