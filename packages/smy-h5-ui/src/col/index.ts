import { type VNode } from 'vue'
import { type SmyComponent } from '../_utils/smy/component'
import { type ColProps } from './props'

import { withInstall } from '../_utils/vue/component'
import Col from './Col.vue'

interface SmyCol extends SmyComponent {
  new (): {
    $props: ColProps
    $scopeSlots: {
      default: () => VNode
    }
  }
}

export default withInstall(Col) as SmyCol
