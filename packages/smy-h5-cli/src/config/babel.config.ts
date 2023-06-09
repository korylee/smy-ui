import type { ConfigAPI } from '@babel/core'

export default function preset(api?: ConfigAPI) {
  if (api) {
    api.cache.never()
  }
  const isCjs = process.env.NODE_ENV === 'test' || process.env.BABEL_MODULE === 'commonjs'

  return {
    presets: [
      [require.resolve('@babel/preset-env'), { loose: true, modules: isCjs ? 'commonjs' : false }],
      [require.resolve('@vue/babel-preset-jsx'), { functional: false }],
      require.resolve('@babel/preset-typescript'),
      require('./babel.sfc.transform'),
    ],
    plugins: [require.resolve('babel-plugin-jsx-v-model'), require.resolve('babel-plugin-jsx-event-modifiers')],
  }
}
