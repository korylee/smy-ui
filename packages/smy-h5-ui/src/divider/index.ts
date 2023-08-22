import { DividerProps } from './props'
import { type SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Divider from './Divider.vue'

interface SmyDivider extends SmyComponent {
  new (): {
    $props: DividerProps
    $scopeSlots: {
      default: () => any
    }
  }
}

export const Divider = withInstall(_Divider) as SmyDivider

export default Divider
