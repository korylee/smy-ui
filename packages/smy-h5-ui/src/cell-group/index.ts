import { type SmyComponent } from '../_utils/smy/component'
import type { CellGroupProps } from './props'

import { withInstall } from '../_utils/vue/component'
import CellGroup from './CellGroup.vue'

declare interface SmyCellGroup extends SmyComponent {
  new (): {
    $props: CellGroupProps
  }
}

export default withInstall(CellGroup) as SmyCellGroup
