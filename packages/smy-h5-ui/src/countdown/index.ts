import type { SmyComponent } from '../_utils/components'
import type { CountdownProps } from './props'

import { withInstall } from '../_utils/components'
import _Countdown from './Countdown.vue'

declare class SmyCountdown extends SmyComponent {
  $props: CountdownProps
}

export default withInstall(_Countdown) as SmyCountdown
