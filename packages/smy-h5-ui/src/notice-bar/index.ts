import type { NoticeBarProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'
import _NoticeBar from './NoticeBar.vue'

declare interface SmyNoticeBar extends SmyComponent {
  new (): {
    $props: NoticeBarProps
  }
}

export default withInstall(_NoticeBar) as unknown as SmyNoticeBar
