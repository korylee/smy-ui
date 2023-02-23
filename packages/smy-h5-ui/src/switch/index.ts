import type { SwtichProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'
import { type VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'

import _Switch from './Switch.vue'

declare interface SmySwitch extends SmyComponent {
  new (): {
    $props: SwtichProps
    $scopeSlots: {
      loading: () => VNode
    }
    $emit: {
      (event: 'change', data: boolean): void
      (event: 'update:value', data?: { position: number }): void
    }
  }
}

export default withInstall(_Switch) as unknown as SmySwitch
