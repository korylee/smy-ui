import { type VNode } from 'vue'
import type { SmyComponent } from '../_utils/smy/component'
import type { StepperProps } from './props'

import Stepper from './Stepper.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyStepper extends SmyComponent {
  new (): {
    $props: StepperProps
    $scopeSlots: {
      'right-icon': () => VNode
      'left-icon': () => VNode
    }
    $emit: {
      (event: 'input', value: number): void
      (event: 'change', value: number): void
      (event: 'blur', data: Event): void
      (event: 'focus', data: Event): void
      (event: 'minus', data: Event): void
      (event: 'minus-no-allow'): void
      (event: 'plus', data: Event): void
      (event: 'plus-no-allow'): void
    }
  }
}
export default withInstall(Stepper) as SmyStepper
