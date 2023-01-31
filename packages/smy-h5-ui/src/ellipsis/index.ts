import type { SmyComponent } from '../_utils/smy/component'
import type { EllipsisProps } from './props'

import { withInstall } from '../_utils/vue/component'
import Ellipsis from './Ellipsis.vue'

declare class SmyEllipsis extends SmyComponent {
  $props: EllipsisProps
}

export default withInstall(Ellipsis) as unknown as SmyEllipsis
