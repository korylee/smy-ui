const path = require('path')
const { defineConfig } = require('rollup')
const esbuild = require('rollup-plugin-esbuild').default
const babel = require('@rollup/plugin-babel').default
const merge = require('deepmerge')

const extensions = ['.mjs', '.js', '.json', '.ts']

const baseConfig = defineConfig({
  input: path.resolve('./src/index.ts'),
  plugins: [
    esbuild({
      tsconfig: path.resolve(__dirname, 'tsconfig.esbuild.json'),
      target: 'es6',
      sourceMap: true,
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
  ],
  external: ['vue'],
  output: {
    name: 'vooks',
    format: 'umd',
    exports: 'named',
    globals: {
      vue: 'Vue',
    },
  },
})

const devConfig = defineConfig({
  plugins: [],
  output: { file: path.resolve('dist/index.js') },
})

module.exports = [merge(baseConfig, devConfig)]
