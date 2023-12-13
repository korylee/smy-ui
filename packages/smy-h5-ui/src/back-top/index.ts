import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _BackTop from './BackTop.vue'
import { BackTopProps } from './props'

interface SmyBackTop extends SmyComponent {
  new (): {
    $props: BackTopProps
    $scopedSlots: {
      default: () => any
    }
    $emits: {
      (event: 'click', data: Event): void
    }
  }
}

export default withInstall(_BackTop) as SmyBackTop
