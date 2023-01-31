import { type ScrollerProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import Scroller from './Scroller.vue'
import { withInstall } from '../_utils/vue/component'

declare class SmyScroller extends SmyComponent {
  $props: ScrollerProps
}

export default withInstall(Scroller) as unknown as SmyScroller
