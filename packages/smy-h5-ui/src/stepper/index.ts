import { type VNode } from 'vue'
import type { SmyComponent } from '../_utils/smy/component'
import type { StepperProps } from './props'

import Stepper from './Stepper.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyStepper extends SmyComponent {
  new (): {
    $props: StepperProps
    $scopedSlots: {
      'right-icon': () => VNode
      'left-icon': () => VNode
    }
    $emit: {
      (event: 'input', value: number): void
      (event: 'change', data: InputEvent): void
      (event: 'keyup', data: KeyboardEvent): void
      (event: 'blur', data: FocusEvent): void
      (event: 'focus', data: FocusEvent): void
      (event: 'minus', data: Event): void
      (event: 'plus', data: Event): void
    }
  }
}
export default withInstall(Stepper) as SmyStepper
