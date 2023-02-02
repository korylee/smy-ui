import type { SmyComponent } from '../_utils/smy/component'
import type { StepsProps } from './props'

import { withInstall } from '../_utils/vue/component'
import _Steps from './Steps'

declare interface SmySteps extends SmyComponent {
  new (): {
    $props: StepsProps
  }
}

export default withInstall(_Steps) as unknown as SmySteps
