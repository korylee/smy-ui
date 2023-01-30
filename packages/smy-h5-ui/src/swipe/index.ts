import { withInstall } from '../_utils/components'
import _Swipe from './Swipe.vue'

import type { SmyComponent } from '../_utils/components'
import type { SwipeProps } from './props'

declare class Swipe extends SmyComponent {
  $props: SwipeProps
}

const SmySwipe = withInstall(_Swipe) as unknown as Swipe

export default SmySwipe