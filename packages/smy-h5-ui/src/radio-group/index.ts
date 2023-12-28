import { VNode } from 'vue'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { RadioProps } from '../radio/props'
import _CheckboxGroup from './RadioGroup'

export declare interface SmyRadioGroup extends SmyComponent {
  new (): {
    $props: RadioProps
    $scopedSlots: {
      default: () => VNode
    }
    $emit: {
      (event: 'input', data: any): void
      (event: 'change', data: any): void
    }
  }
}

export default withInstall(_CheckboxGroup) as SmyRadioGroup
