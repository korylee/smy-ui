import type { SmyComponent } from '../_utils/smy/component'
import type { CountdownProps } from './props'

import { withInstall } from '../_utils/vue/component'
import _Countdown from './Countdown.vue'
export { getDate } from './utils'

declare class SmyCountdown extends SmyComponent {
  $props: CountdownProps
}

export default withInstall(_Countdown) as SmyCountdown
