import { pathExistsSync } from 'fs-extra'
import { resolve } from 'path'
import {
  CWD,
  DOCS_DIR_NAME,
  EXAMPLE_DIR_NAME,
  JEST_MEDIA_MOCK,
  JEST_STYLE_MOCK,
  SITE_UI_ENTRY,
  TESTS_DIR_NAME,
  UI_PACKAGE_JSON,
} from '../shared/constant'
import { type Config } from 'jest'

function getRootConfig() {
  const file = resolve(CWD, 'jest.config.js')

  if (pathExistsSync(file)) {
    delete require.cache[require.resolve(file)]
    return require(file)
  }

  return {}
}

const { name: uiName } = require(UI_PACKAGE_JSON)

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less)$': JEST_STYLE_MOCK,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': JEST_MEDIA_MOCK,
    [uiName]: SITE_UI_ENTRY,
  },
  transform: {
    '\\.(vue)$': '@vue/vue2-jest',
    '\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx,vue}',
    `!**/${EXAMPLE_DIR_NAME}/**`,
    `!**/${DOCS_DIR_NAME}/**`,
    `!**/${TESTS_DIR_NAME}/**`,
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
  transformIgnorePatterns: [],
  ...getRootConfig(),
} as Config
