export type { TeleportProps } from './props'
import { type VNode } from 'vue'
import { type SmyComponent } from '../_utils/smy/component'
import { createMaybeComponent, withInstall } from '../_utils/vue/component'
import { type TeleportProps } from './props'
import _Teleport from './Teleport'

declare interface SmyTeleport extends SmyComponent {
  new (): {
    $props: TeleportProps
    $scopeSlots: { default: () => VNode }
  }
}

const Teleport = withInstall(_Teleport) as SmyTeleport

export const MaybeTeleport = createMaybeComponent(Teleport)

export default Teleport
