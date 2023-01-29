import { type SmyComponent, withInstall } from '../_utils/components'
import Scroller from './Scroller.vue'
import { type ScrollerProps } from './props'

declare class SmyScroller extends SmyComponent {
  $props: ScrollerProps
}

export default withInstall(Scroller) as unknown as SmyScroller
