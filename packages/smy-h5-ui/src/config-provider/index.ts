import type { VNode } from 'vue'
import { type SmyComponent } from '../_utils/smy/component'
import type { ConfigProviderProps } from './props'

import { formatStyleVars, type StyleVars } from '../_utils/style'
import _ConfigProvider from './ConfigProvider.vue'
import { withInstall } from '../_utils/vue/component'

export type { ConfigProviderProps } from './props'

declare interface SmyConfigProvider extends SmyComponent {
  new (): {
    $props: ConfigProviderProps
    $scopeSlots: {
      default: () => VNode
    }
  }
}

const mountedVarKeys: string[] = []

const ConfigProvider = function ConfigProvider(opts: Omit<ConfigProviderProps, 'tag'> = {}) {
  const { styleVars = {} } = opts
  mountedVarKeys.forEach((key) => document.documentElement.style.removeProperty(key))
  mountedVarKeys.length = 0
  const styles: StyleVars = formatStyleVars(styleVars)
  Object.entries(styles).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
    mountedVarKeys.push(key)
  })
}
const _SmyConfigProvider = withInstall(_ConfigProvider) as SmyConfigProvider
ConfigProvider.Component = _SmyConfigProvider

ConfigProvider.install = _SmyConfigProvider.install

export default ConfigProvider
