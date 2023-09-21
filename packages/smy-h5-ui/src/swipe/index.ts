import { withInstall } from '../_utils/vue/component'
import _Swipe from './Swipe.vue'

import type { SmyComponent } from '../_utils/smy/component'
import type { SwipeProps } from './props'
import { type VNode } from 'vue'

type SwipePosition = 'left' | 'right'

declare interface SmySwipe extends SmyComponent {
  new (): {
    $props: SwipeProps
    $scopeSlots: {
      left: () => VNode
      default: () => VNode
      right: () => VNode
    }
    $emit: {
      (event: 'close', data?: { position: SwipePosition | 'outside' }): void
      (event: 'open', data?: { position: SwipePosition }): void
    }
  }
}

const SmySwipe = withInstall(_Swipe) as unknown as SmySwipe

export default SmySwipe
