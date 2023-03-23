import type { SmyComponent } from '../_utils/smy/component'
import type { IconProps } from './props'
import { type VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _Icon from './Icon.vue'

declare interface SmyIcon extends SmyComponent {
  new (): {
    $props: IconProps
    $scopeSlots: {
      default: () => VNode
    }
  }
}

export default withInstall(_Icon) as unknown as SmyIcon
