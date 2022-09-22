/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  rules: {
    // typescript-eslint
    '@typescript-eslint/no-var-requires': 'off',
  },
  overrides: [],
})
