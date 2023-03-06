import { type VNode } from 'vue'
import { type SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { type RowProps } from './props'
import Row from './Row.vue'

interface SmyRow extends SmyComponent {
  new (): {
    $props: RowProps
    $scopeSlots: {
      default: () => VNode
    }
  }
}

export default withInstall(Row) as SmyRow
