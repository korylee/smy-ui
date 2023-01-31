import type { SmyComponent } from '../_utils/smy/component'
import type { StepProps } from './props'

import _Step from './Step.vue'
import { withInstall } from '../_utils/vue/component'

declare class SmyStep extends SmyComponent {
  $props: StepProps
}

export default withInstall(_Step) as SmyStep
