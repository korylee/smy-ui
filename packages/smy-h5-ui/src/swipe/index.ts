import { withInstall } from '../_utils/vue/component'
import _Swipe from './Swipe.vue'

import type { SmyComponent } from '../_utils/smy/component'
import type { SwipeProps } from './props'

declare class Swipe extends SmyComponent {
  $props: SwipeProps
}

const SmySwipe = withInstall(_Swipe) as unknown as Swipe

export default SmySwipe
