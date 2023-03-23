import {
  SITE_CONFIG,
  SITE_DIR,
  SITE_MOBILE_ROUTES,
  SITE_OUTPUT_PATH,
  SITE_PC_ROUTES,
  SITE_PUBLIC_PATH,
  VITE_RESOLVE_EXTENSION,
} from '../shared/constant'
import { get } from 'lodash'
import { InlineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { injectHtml } from 'vite-plugin-html'
import { resolve } from 'path'
import markdownPlugin from '@smy-h5/markdown-vite-plugin'

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
