import { VNode } from 'vue'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Checkbox from './Checkbox'
import { CheckboxProps } from './props'

declare interface SmyCheckbox extends SmyComponent {
  new (): {
    $props: CheckboxProps
    $scopedSlots: {
      icon: () => VNode
      default: () => VNode
    }
    $emit: {
      (event: 'input', data: boolean): void
      (event: 'change', data: boolean): void
    }
  }
}

export default withInstall(_Checkbox) as SmyCheckbox
