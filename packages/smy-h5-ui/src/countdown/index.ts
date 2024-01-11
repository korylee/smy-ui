import type { SmyComponent } from '../_utils/smy/component'
import type { CountdownProps } from './props'
import type { TimeData } from './utils'
import type { VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _Countdown from './Countdown.jsx'

declare interface SmyCountdown extends SmyComponent {
  new (): {
    $props: CountdownProps
    $emit: {
      (event: 'change', time: TimeData): void
      (event: 'end'): void
      (event: 'start', pauseTime: number): void
      (event: 'pause', pauseTime: number): void
      (event: 'update:paused', paused: boolean): void
    }
    $scopedSlots: {
      default: (data: TimeData) => VNode
    }
  }
}

export default withInstall(_Countdown) as SmyCountdown
