import type { ConfigAPI } from '@babel/core'

export default function preset(api?: ConfigAPI) {
  if (api) {
    api.cache.never()
  }
  const isCommonJS = process.env.NODE_ENV === 'test' || process.env.BABEL_MODULE === 'commonjs'

  return {
    presets: [
      [require.resolve('@babel/preset-env'), { loose: true, modules: isCommonJS ? 'commonjs' : false }],
      [require.resolve('@vue/babel-preset-jsx')],
      require.resolve('@babel/preset-typescript'),
      require('./babel.sfc.transform'),
    ],
    plugins: [
      /**
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          useEsModules,
          version: require('@babel/runtime-corejs3/package.json').version,
          absoluteRuntime: path.dirname(require.resolve('@babel/runtime-corejs3/package.json')),
        },
      ],
       */
      require.resolve('babel-plugin-jsx-v-model'),
      require.resolve('babel-plugin-jsx-event-modifiers'),
    ],
  }
}
