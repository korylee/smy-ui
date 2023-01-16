import { type SmyComponent, withInstall } from '../_utils/components'
import type { SwtichProps } from './props'
import _Switch from './Switch.vue'

declare class SmySwitch extends SmyComponent {
  $props: SwtichProps
}

export default withInstall(_Switch) as unknown as SmySwitch
