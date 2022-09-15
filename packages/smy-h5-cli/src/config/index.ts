import type { InlineConfig } from 'vite'
import { get, kebabCase } from 'lodash'
import { resolve } from 'path'
import { ES_DIR } from '../shared/constant'

export function getESMBundleConfig(config: Record<string, any>): InlineConfig {
  const name = get(config, 'name')
  const filename = `${kebabCase(name)}.esm.js`
  return {
    logLevel: 'silent',
    build: {
      emptyOutDir: true,
      lib: {
        name,
        formats: ['es'],
        fileName: () => filename,
        entry: resolve(ES_DIR, 'umdIndex.js'),
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          dir: ES_DIR,
          exports: 'named',
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  }
}
