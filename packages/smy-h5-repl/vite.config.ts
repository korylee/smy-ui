import fs from 'node:fs'
import path from 'node:path'
import { Plugin, defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import dts from 'vite-plugin-dts'

const patchCssFiles: Plugin = {
  name: 'patch-css',
  apply: 'build',
  writeBundle() {
    const outDir = path.resolve('dist')
    fs.renameSync(path.resolve(outDir, 'MonacoEditor.css'), path.resolve(outDir, 'monaco-editor.css'))
    ;['repl', 'monaco-editor', 'codemirror-editor'].forEach((file) => {
      const filePath = path.resolve(outDir, file + '.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      fs.writeFileSync(filePath, `import './${file}.css'\n${content}`)
    })
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin({
      include: [/\.vue$/],
      jsx: true,
    }),
    // dts({
    //   rollupTypes: true,
    //   cleanVueFileName: true,
    //   compilerOptions: {
    //     allowJs: true
    //   }
    // }),
    patchCssFiles,
  ],
  optimizeDeps: {
    include: ['typescript', 'monaco-editor-core/esm/vs/editor/editor.worker'],
  },
  base: './',
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: {
        repl: './src/index.ts',
        'monaco-editor': './src/editor/MonacoEditor.jsx',
        'codemirror-editor': './src/editor/CodeMirrorEditor.jsx',
      },
      formats: ['es'],
      fileName: () => '[name].js',
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      external: ['vue', '@vue/compiler-sfc'],
    },
  },
})
