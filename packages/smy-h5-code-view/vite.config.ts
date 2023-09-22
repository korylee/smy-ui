import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // @ts-ignore
    createVuePlugin({
      include: [/\.vue$/],
      jsx: true,
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'code-view.js',
    },
    rollupOptions: {
      external: ['vue', '@vue/compiler-sfc'],
    },
  },
})
