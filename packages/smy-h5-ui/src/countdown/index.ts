import type { SmyComponent } from '../_utils/components'
import type { CountdownProps } from './props'

import { withInstall } from '../_utils/components'
import _Countdown from './Countdown.vue'
export { getDate } from './utils'

declare class SmyCountdown extends SmyComponent {
  $props: CountdownProps
}

export default withInstall(_Countdown) as SmyCountdown
