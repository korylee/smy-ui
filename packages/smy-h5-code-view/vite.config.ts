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
      entry: { 'code-view': './src/index.ts' },
      formats: ['es'],
      fileName: () => '[name].js',
    },
    rollupOptions: {
      external: ['vue', '@vue/compiler-sfc'],
    },
  },
})
