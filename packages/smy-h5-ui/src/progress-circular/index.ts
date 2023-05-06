import type { ProgressCircularProps } from './props'
import type { VNode } from 'vue'
import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'
import ProgressCircular from './ProgressCircular.vue'
declare interface SmyProgressCircular extends SmyComponent {
  new (): {
    $props: ProgressCircularProps
    $scopeSlots: {
      default: (data: { value: number }) => VNode
    }
  }
}

export default withInstall(ProgressCircular) as SmyProgressCircular
