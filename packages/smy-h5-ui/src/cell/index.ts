import type { SmyComponent } from '../_utils/components'
import type { CellProps } from './props'

import { withInstall } from '../_utils/components'
import _Cell from './Cell.vue'

declare class SmyCell extends SmyComponent {
  $props: CellProps
}

export default withInstall(_Cell) as SmyCell
