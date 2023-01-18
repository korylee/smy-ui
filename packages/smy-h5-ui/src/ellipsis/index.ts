import type { SmyComponent } from '../_utils/components'
import type { EllipsisProps } from './props'

import { withInstall } from '../_utils/components'
import Ellipsis from './Ellipsis.vue'

declare class SmyEllipsis extends SmyComponent {
  $props: EllipsisProps
}

export default withInstall(Ellipsis) as unknown as SmyEllipsis
