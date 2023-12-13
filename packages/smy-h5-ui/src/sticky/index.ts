import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Sticky from './Sticky.vue'
import { StickyProp } from './props'

declare interface SmySticky extends SmyComponent {
  new (): {
    $props: StickyProp
    $scopedSlots: {
      default: () => any
    }
    $emit: {
      (event: 'change', data: boolean): void
      (event: 'scroll', data: { scrollTop: number; isFixed: boolean }): void
    }
  }
}

export default withInstall(_Sticky) as SmySticky
