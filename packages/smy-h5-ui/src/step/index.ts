import type { SmyComponent } from '../_utils/smy/component'
import type { StepProps } from './props'

import _Step from './Step.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyStep extends SmyComponent {
  new (): {
    $props: StepProps
    $scopedSlots: {
      title: () => void
      default: () => void
      icon: () => void
    }
  }
}

export default withInstall(_Step) as SmyStep
