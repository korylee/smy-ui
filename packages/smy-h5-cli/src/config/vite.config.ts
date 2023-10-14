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
import { BuildOptions, InlineConfig, LibraryFormats, Plugin } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { injectHtml } from 'vite-plugin-html'
import { resolve } from 'path'
import markdownPlugin from '@smy-h5/markdown-vite-plugin'
import { SmyConfig } from './smyConfig'
import { pathExistsSync, removeSync, readFileSync, writeFileSync, copyFileSync } from 'fs-extra'
import stripWith from 'vue-template-es2015-compiler'

export function getDevConfig(smyConfig: SmyConfig): InlineConfig {
  const { host } = smyConfig
  const { NODE_ENV } = process.env
  const { name: uiName } = require(UI_PACKAGE_JSON)

  return {
    root: SITE_DIR,
    resolve: {
      extensions: VITE_RESOLVE_EXTENSION,
      alias: {
        '@config': SITE_CONFIG,
        '@pc-routes': SITE_PC_ROUTES,
        '@mobile-routes': SITE_MOBILE_ROUTES,
        [uiName]: NODE_ENV === 'development' ? SITE_UI_ENTRY : resolve(ES_DIR, 'index.bundle.js'),
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
      markdownPlugin(),
      injectHtml({
        data: {
          pcTitle: get(smyConfig, `pc.title`),
          mobileTitle: smyConfig?.mobile?.title,
          logo: smyConfig?.logo,
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
  entry: string
  minify: BuildOptions['minify']
}

export function getBundleConfig(smyConfig: SmyConfig, buildOptions: BundleBuildOptions): InlineConfig {
  const plugins = []
  const name = smyConfig.name
  const { fileName, output, format, emptyOutDir, removeEnv, entry, minify } = buildOptions
  if (format === 'umd') {
    plugins.push(inlineCss(fileName, output))
  }
  return {
    logLevel: 'silent',
    define: removeEnv ? { 'process.env.NODE_ENV': '"production"' } : undefined,
    plugins,
    build: {
      minify,
      emptyOutDir,
      copyPublicDir: false,
      lib: {
        name,
        formats: [format],
        fileName: () => fileName,
        entry,
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
      writeFileSync(jsFile, `${stripWith(injectCode)}${stripWith(jsCode)}`)
      copyFileSync(cssFile, resolve(LIB_DIR, 'style.css'))
      removeSync(cssFile)
    },
  }
}
