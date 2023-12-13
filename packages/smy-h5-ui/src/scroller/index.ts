import { type ScrollerProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'
import type { VNode } from 'vue'

import Scroller from './Scroller.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyScroller extends SmyComponent {
  new (): {
    $props: ScrollerProps
    $scopedSlots: {
      default: () => VNode
      loading: () => VNode
      'loading-icon': () => VNode
      finished: () => VNode
    }
    $emit: {
      (event: 'scroll-change', scrollTop: number): void
      (event: 'input', data: boolean): void
      (event: 'load-more'): void
    }
  }
}

export default withInstall(Scroller) as unknown as SmyScroller
