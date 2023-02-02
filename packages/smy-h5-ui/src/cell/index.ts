import type { SmyComponent } from '../_utils/smy/component'
import type { CellProps } from './props'

import { withInstall } from '../_utils/vue/component'
import _Cell from './Cell.vue'

declare interface SmyCell extends SmyComponent {
  new (): {
    $props: CellProps
  }
}

export default withInstall(_Cell) as SmyCell
