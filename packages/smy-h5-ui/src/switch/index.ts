import type { SwtichProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'

import _Switch from './Switch.vue'

declare interface SmySwitch extends SmyComponent {
  new (): {
    $props: SwtichProps
  }
}

export default withInstall(_Switch) as unknown as SmySwitch
