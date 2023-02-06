export type { TeleportProps } from './props'
import { type VNode } from 'vue'
import { type SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { type TeleportProps } from './props'
import Teleport from './Teleport'

declare interface SmyTeleport extends SmyComponent {
  new (): {
    $props: TeleportProps
    $scopeSlots: { default: () => VNode }
  }
}

export default withInstall(Teleport) as SmyTeleport
