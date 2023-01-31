export type { TeleportProps } from './props'
import { createInstall } from '../_utils/vue/component'
import Teleport from './Teleport'

Teleport.install = createInstall(Teleport)

export default Teleport
