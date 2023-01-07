import type { SmyComponent } from '../_utils/components'
import type { StepsProps } from './props'

import { withInstall } from '../_utils/components'
import _Steps from './Steps'

declare class SmySteps extends SmyComponent {
  $props: StepsProps
}

export default withInstall(_Steps) as unknown as SmySteps
