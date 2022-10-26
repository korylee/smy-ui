import { createInstall } from '../_utils/components'
import ConfitProvider from './ConfigProvider.vue'
export type { ConfigProviderProps, StyleVars } from './props'

ConfitProvider.install = createInstall(ConfitProvider)

export default ConfitProvider
