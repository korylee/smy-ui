import {
  SITE_CONFIG,
  SITE_DIR,
  SITE_MOBILE_ROUTES,
  SITE_OUTPUT_PATH,
  SITE_PC_ROUTES,
  SITE_PUBLIC_PATH,
  VITE_RESOLVE_EXTENSION,
  LIB_DIR,
  ES_DIR,
  SITE_UI_ENTRY,
  UI_PACKAGE_JSON,
} from '../shared/constant'
import { get } from 'lodash'
import { InlineConfig, LibraryFormats, Plugin } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { injectHtml } from 'vite-plugin-html'
import { resolve } from 'path'
import markdownPlugin from '@smy-h5/markdown-vite-plugin'
import { SmyConfig } from './smyConfig'
import { pathExistsSync, removeSync, readFileSync, writeFileSync, copyFileSync } from 'fs-extra'

export function getDevConfig(smyConfig: SmyConfig): InlineConfig {
  const { host } = smyConfig
  const { NODE_ENV } = process.env
  console.log('root: ', SITE_DIR)
  const __DEV__ = NODE_ENV === 'development'
  const { name: uiName } = require(UI_PACKAGE_JSON)

  return {
    root: SITE_DIR,
    define: { __DEV__ },
    resolve: {
      extensions: VITE_RESOLVE_EXTENSION,
      alias: {
        '@config': SITE_CONFIG,
        '@pc-routes': SITE_PC_ROUTES,
        '@mobile-routes': SITE_MOBILE_ROUTES,
        [uiName]: __DEV__ ? SITE_UI_ENTRY : resolve(ES_DIR, 'index.bundle.js'),
      },
    },
    server: {
      port: smyConfig.port,
      host: host === 'localhost' ? '0.0.0.0' : host,
    },
    publicDir: SITE_PUBLIC_PATH,
    plugins: [
      createVuePlugin({
        include: [/\.vue$/, /\.md$/],
        jsx: true,
      }),
      markdownPlugin({
        style: get(smyConfig, 'highlight.style'),
      }),
      injectHtml({
        data: {
          pcTitle: get(smyConfig, `pc.title`),
          mobileTitle: get(smyConfig, `mobile.title`),
          logo: get(smyConfig, 'logo', ''),
        },
      }),
    ],
  }
}

export function getBuildConfig(smyConfig: Record<string, any>): InlineConfig {
  const devConfig = getDevConfig(smyConfig)

  return {
    ...devConfig,
    base: './',
    build: {
      outDir: SITE_OUTPUT_PATH,
      reportCompressedSize: false,
      emptyOutDir: true,
      cssTarget: 'chrome61',
      rollupOptions: {
        input: {
          main: resolve(SITE_DIR, 'index.html'),
          mobile: resolve(SITE_DIR, 'mobile.html'),
        },
      },
    },
  }
}

export interface BundleBuildOptions {
  fileName: string
  output: string
  format: LibraryFormats
  removeEnv: boolean
  emptyOutDir: boolean
}

export function getBundleConfig(smyConfig: SmyConfig, buildOptions: BundleBuildOptions): InlineConfig {
  const plugins = []
  const name = smyConfig.name
  const { fileName, output, format, emptyOutDir, removeEnv } = buildOptions
  if (format === 'umd') {
    plugins.push(inlineCss(fileName, output))
  }
  return {
    logLevel: 'silent',
    define: removeEnv ? { 'process.env.NODE_ENV': '"production"' } : undefined,
    plugins,
    build: {
      minify: format === 'cjs' ? false : 'esbuild',
      emptyOutDir,
      copyPublicDir: false,
      lib: {
        name,
        formats: [format],
        fileName: () => fileName,
        entry: resolve(ES_DIR, 'index.bundle.js'),
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          dir: output,
          exports: 'named',
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  }
}

function inlineCss(filename: string, dir: string): Plugin {
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
