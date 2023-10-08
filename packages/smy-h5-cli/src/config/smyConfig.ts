import { pathExistsSync } from 'fs-extra'
import { SITE_CONFIG, SMY_CONFIG } from '../shared/constant'
import { merge } from 'lodash'
import { outputFileSyncOnChange } from '../shared/fs-utils'

interface PcMenu {
  text?: string
  /** 标题：1 组件：2 描述：3*/
  type: 1 | 2 | 3
  doc?: string
}

export interface SmyConfig {
  /**
   * @default `Smy`
   * UI library name.
   */
  name?: string
  useMobile?: boolean
  /**
   * @default `localhost`
   * Local dev server host
   */
  host?: string
  port?: number
  pc?: {
    menu?: PcMenu[]
    header?: Record<string, any>
    indexPage?: {
      description?: string
      started?: string
      features?: { name?: string; description?: string }[]
    }
  }
  [k: string]: any
}

export function getSmyConfig(emit = false): SmyConfig {
  let config: any = {}
  if (pathExistsSync(SMY_CONFIG)) {
    delete require.cache[require.resolve(SMY_CONFIG)]
    config = require(SMY_CONFIG)
  }
  delete require.cache[require.resolve('../../smy.default.config.js')]
  const defaultConfig = require('../../smy.default.config')
  const mergedConfig = merge(defaultConfig, config)
  if (emit) {
    const source = JSON.stringify(mergedConfig, null, 2)
    outputFileSyncOnChange(SITE_CONFIG, source)
  }
  return mergedConfig
}

export function defineConfig(config: SmyConfig) {
  return config
}
