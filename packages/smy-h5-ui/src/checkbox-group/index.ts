import { VNode } from 'vue'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _CheckboxGroup from './CheckboxGroup'
import { CheckboxGroupProps } from './props'

export declare interface SmyCheckboxGroup extends SmyComponent {
  new (): {
    $props: CheckboxGroupProps
    $scopedSlots: {
      default: () => VNode
    }
    $emit: {
      (event: 'input', data: any[]): void
      (event: 'change', data: any[]): void
    }
  }
}

export default withInstall(_CheckboxGroup) as SmyCheckboxGroup
