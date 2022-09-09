import { defineConfig } from 'eslint-define-config'

export default defineConfig({
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  env: {
    es6: true,
    node: true,
    jest: true,
    browser: true,
  },
  rules: {
    'no-use-before-define': 'off',
    'max-classes-per-file': 'off',
    'no-new': 'off',
    'no-shadow': 'off',
    'no-bitwise': 'off',
    'func-names': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'default-case': 'off',
    'prefer-template': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'no-nested-ternary': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-restricted-globals': 'off',
    'class-methods-use-this': 'off',
    'global-require': 'off',
    'no-template-curly-in-string': 'off',
    'no-await-in-loop': 'off',
    radix: 'off',
    'prefer-destructuring': 'off',
    // eslint-plugin-import
    'import/no-dynamic-require': 'off',
    'import/order': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  overrides: [
    {
      files: '*.vue',
      rules: {
        // eslint-plugin-vue
        'vue/no-v-html': 'off',
        'vue/attributes-order': 'off',
        'vue/require-default-prop': 'off',
        'vue/no-unused-components': 'off',
        'vue/valid-v-bind': 'off',
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        // typescript-eslint
        '@typescript-eslint/class-name-casing': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },
  ],
})
