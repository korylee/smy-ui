import { withInstall } from '../_utils/components'
import _Swipe from './Swipe.vue'

import type { SmyCompoent } from '../_utils/components'
import type { SwipeProps } from './props'

declare class Swipe extends SmyCompoent {
  $props: SwipeProps
}

const SmySwipe = withInstall(_Swipe) as unknown as Swipe

export default SmySwipe
