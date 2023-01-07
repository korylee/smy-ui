import type { SmyComponent } from '../_utils/components'
import type { StepProps } from './props'

import _Step from './Step.vue'
import { withInstall } from '../_utils/components'

declare class SmyStep extends SmyComponent {
  $props: StepProps
}

export default withInstall(_Step) as SmyStep
