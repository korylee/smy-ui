import type { SmyComponent } from '../_utils/smy/component'
import type { CellProps } from './props'
import type { VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _Cell from './Cell.jsx'

declare interface SmyCell extends SmyComponent {
  new (): {
    $props: CellProps
    $scopedSlots: {
      icon: () => VNode
      default: () => VNode
      desc: () => VNode
      extra: () => VNode
    }
  }
}

export default withInstall(_Cell) as SmyCell
