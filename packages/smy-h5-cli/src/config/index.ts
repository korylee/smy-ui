import type { InlineConfig, PluginOption } from 'vite'
import { kebabCase } from 'lodash'
import { resolve } from 'path'
import { CWD, ES_DIR, UMD_DIR, LIB_DIR } from '../shared/constant'
import { pathExistsSync, removeSync, readFileSync, writeFileSync, copyFileSync } from 'fs-extra'

const SmyClearVitePlugin: PluginOption = {
  name: 'smy-clear-vite-plugin',
  apply: 'build',
  closeBundle() {
    removeSync(resolve(CWD, 'dist'))
  },
}

export function getESMBundleConfig(config: Record<string, any>): InlineConfig {
  const { name } = config
  const filename = `${kebabCase(name)}.esm.js`
  return {
    logLevel: 'silent',
    build: {
      emptyOutDir: false,
      copyPublicDir: false,
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
    plugins: [],
  }
}

export function getUMDConfig(smyConfig: Record<string, any>): InlineConfig {
  const { name } = smyConfig
  const filename = `${kebabCase(name)}.js`

  return {
    logLevel: 'silent',
    build: {
      target: 'es6',
      emptyOutDir: true,
      lib: {
        name,
        formats: ['umd'],
        fileName: () => filename,
        entry: resolve(ES_DIR, 'umdIndex.js'),
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          dir: UMD_DIR,
          exports: 'named',
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
    plugins: [inlineCss(filename, UMD_DIR), SmyClearVitePlugin],
  }
}

function inlineCss(filename: string, dir: string): PluginOption {
  return {
    name: 'smy-inline-css-vite-plugin',
    apply: 'build',
    closeBundle() {
      const cssFile = resolve(dir, 'style.css')
      if (!pathExistsSync(cssFile)) return
      const jsFile = resolve(dir, filename)
      const cssCode = readFileSync(cssFile, 'utf-8').replace(/\\/g, '\\\\')
      const jsCode = readFileSync(jsFile, 'utf-8')
      const injectCode = `;(function() {var style=document.createElement('style');style.type='text/css';style.rel='stylesheet';style.appendChild(document.createTextNode(\`${cssCode}\`));var head=document.querySelector('head');head.appendChild(style);})();`
      writeFileSync(jsFile, `${injectCode}${jsCode}`)
      copyFileSync(cssFile, resolve(LIB_DIR, 'style.css'))
      removeSync(cssFile)
    },
  }
}
