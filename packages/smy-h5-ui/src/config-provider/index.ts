import { formatStyleVars } from '../_utils/dom'
import { createInstall } from '../_utils/vue/component'
import SmyConfigProvider from './ConfigProvider.vue'
import type { StyleVars } from './props'

export type { ConfigProviderProps } from './props'

export type { StyleVars }

const mountedVarKeys: string[] = []

const ConfigProvider = function ConfigProvider(styleVars: StyleVars | null = {}) {
  mountedVarKeys.forEach((key) => document.documentElement.style.removeProperty(key))
  mountedVarKeys.length = 0
  const styles: StyleVars = formatStyleVars(styleVars as any)
  Object.entries(styles).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
    mountedVarKeys.push(key)
  })
}

ConfigProvider.install = createInstall(SmyConfigProvider)
ConfigProvider.Component = SmyConfigProvider

SmyConfigProvider.install = ConfigProvider.install

export default ConfigProvider
