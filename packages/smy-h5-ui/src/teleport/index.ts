export type { TeleportProps } from './props'
import { type VNode } from 'vue'
import { type SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { type TeleportProps } from './props'
import _Teleport from './Teleport'

export declare interface SmyTeleport extends SmyComponent {
  new (): {
    $props: TeleportProps
    $scopedSlots: { default: () => VNode }
  }
}

export const Teleport = withInstall(_Teleport) as SmyTeleport

export default Teleport
