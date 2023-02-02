import type { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import type { StepperProps } from './props'
import Stepper from './Stepper.vue'

declare interface SmyStepper extends SmyComponent {
  new (): {
    $props: StepperProps
  }
}
export default withInstall(Stepper) as SmyStepper
