import type { ConfigAPI } from '@babel/core'

interface ConfigOptions {
  loose?: boolean
  enableObjectSlots?: boolean
}

export default function preset(api?: ConfigAPI, options: ConfigOptions = {}) {
  if (api) {
    api.cache.never()
  }
  const isCjs = process.env.NODE_ENV === 'test' || process.env.BABEL_MODULE === 'commonjs'
  const { loose = true, enableObjectSlots = false } = options

  return {
    presets: [
      [require.resolve('@babel/preset-env'), { loose, modules: isCjs ? 'commonjs' : false }],
      require.resolve('@babel/preset-typescript'),
      require('./babel.sfc.transform'),
    ],
    plugins: [['@vue/babel-plugin-jsx', { enableObjectSlots }]],
  }
}
