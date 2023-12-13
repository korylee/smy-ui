import type { NoticeBarProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'
import type { VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _NoticeBar from './NoticeBar.vue'

declare interface SmyNoticeBar extends SmyComponent {
  new (): {
    $props: NoticeBarProps
    $scopedSlots: {
      'left-icon': () => VNode
      default: () => VNode
      'right-icon': () => VNode
    }
    $emit: {
      (event: 'click', data: Event): void
      (event: 'close', data: Event): void
    }
  }
}

export default withInstall(_NoticeBar) as unknown as SmyNoticeBar
