import {
  BUNDLE_ENRTY_FILENAME,
  ES_DIR,
  SITE_CONFIG,
  SITE_DIR,
  SITE_MOBILE_ROUTES,
  SITE_OUTPUT_PATH,
  SITE_PC_ROUTES,
  SITE_PUBLIC_PATH,
  VITE_RESOLVE_EXTENSION,
} from '../shared/constant'
import { get } from 'lodash'
import { InlineConfig, Plugin } from 'vite'
import { injectHtml } from 'vite-plugin-html'
import { resolve } from 'path'
import markdownPlugin from '@smy-h5/markdown-vite-plugin'
import createVuePlugin from '@vitejs/plugin-vue'
import { SmyConfig } from './smyConfig'
import { pathExistsSync, readFileSync, removeSync, writeFileSync } from 'fs-extra'

export function getDevConfig(smyConfig: Record<string, any>): InlineConfig {
  const { host } = smyConfig
  console.log('root: ', SITE_DIR)

  return {
    root: SITE_DIR,
    resolve: {
      extensions: VITE_RESOLVE_EXTENSION,
      alias: {
        '@config': SITE_CONFIG,
        '@pc-routes': SITE_PC_ROUTES,
        '@mobile-routes': SITE_MOBILE_ROUTES,
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
  filename: string
  output: string
  format: 'es' | 'cjs' | 'umd'
  emptyOutDir: boolean
}

export function getBundleConfig(smyConfig: SmyConfig, buildOptions: BundleBuildOptions): InlineConfig {
  const plugins = []
  const name = smyConfig.name
  const { filename, output, format, emptyOutDir } = buildOptions

  if (format === 'umd') {
    plugins.push(
      inlineCss({
        jsFile: resolve(output, filename),
        cssFile: resolve(output, 'style.css'),
      })
    )
  }

  const define = format === 'umd' ? { 'procss.env.NODE_ENV': JSON.stringify('production') } : undefined
  const minify = format === 'cjs' ? false : 'esbuild'
  return {
    logLevel: 'silent',
    define,
    plugins,
    build: {
      minify,
      emptyOutDir,
      copyPublicDir: false,
      lib: {
        name,
        formats: [format],
        fileName: () => filename,
        entry: resolve(ES_DIR, BUNDLE_ENRTY_FILENAME),
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

interface InlineCssOptions {
  cssFile: string
  jsFile: string
  onEnd?: () => void
}

function inlineCss(options: InlineCssOptions): Plugin {
  return {
    name: 'smy-inline-css-vite-plugin',
    apply: 'build',
    closeBundle() {
      const { cssFile, jsFile, onEnd } = options
      if (!pathExistsSync(cssFile)) {
        this.warn(`css file '${cssFile}' cannot found`)
        onEnd?.()
        return
      }
      const cssCode = readFileSync(cssFile, 'utf-8').replace(/\\/g, '\\\\')
      const jsCode = readFileSync(jsFile, 'utf-8')
      const injectCode = `;(function() {var style=document.createElement('style');style.type='text/css';style.rel='stylesheet';style.appendChild(document.createTextNode(\`${cssCode}\`));var head=document.querySelector('head');head.appendChild(style);})();`
      writeFileSync(jsFile, `${injectCode}${jsCode}`)
      removeSync(cssFile)
      onEnd?.()
    },
  }
}
