import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    outDir: 'lib',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@korylee/utils',
      fileName: (formate) => `index.${formate}.js`,
    },
  },
})
