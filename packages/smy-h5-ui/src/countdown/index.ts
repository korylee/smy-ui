import type { SmyComponent } from '../_utils/smy/component'
import type { CountdownProps } from './props'

import { withInstall } from '../_utils/vue/component'
import _Countdown from './Countdown.vue'
export { getDate } from './utils'

declare interface SmyCountdown extends SmyComponent {
  new (): {
    $props: CountdownProps
  }
}

export default withInstall(_Countdown) as SmyCountdown
