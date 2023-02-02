import { type ScrollerProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import Scroller from './Scroller.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyScroller extends SmyComponent {
  new (): {
    $props: ScrollerProps
  }
}

export default withInstall(Scroller) as unknown as SmyScroller
