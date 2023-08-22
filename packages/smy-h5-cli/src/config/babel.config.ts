import type { ConfigAPI } from '@babel/core'

export default function preset(api?: ConfigAPI) {
  if (api) {
    api.cache.never()
  }
  const { BABEL_MODULE, NODE_ENV } = process.env
  const isTest = NODE_ENV === 'test'
  const useEsModules = BABEL_MODULE !== 'commonjs' && !isTest

  return {
    presets: [
      [require.resolve('@babel/preset-env'), { loose: true, modules: useEsModules ? false : 'commonjs' }],
      [require.resolve('@vue/babel-preset-jsx'), { functional: false }],
      require.resolve('@babel/preset-typescript'),
      require('./babel.sfc.transform'),
    ],
    plugins: [
      // [require.resolve('@babel/plugin-transform-runtime'), { corejs: false, useEsModules }],
      require.resolve('babel-plugin-jsx-v-model'),
      require.resolve('babel-plugin-jsx-event-modifiers'),
    ],
  }
}
