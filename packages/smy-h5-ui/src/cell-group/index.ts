import { type SmyComponent } from '../_utils/smy/component'
import type { CellGroupProps } from './props'
import type { VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import CellGroup from './CellGroup.vue'

declare interface SmyCellGroup extends SmyComponent {
  new (): {
    $props: CellGroupProps
    $scopedSlots: {
      default: () => VNode
    }
  }
}

export default withInstall(CellGroup) as SmyCellGroup
