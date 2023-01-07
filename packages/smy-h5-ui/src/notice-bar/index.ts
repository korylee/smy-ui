import type { SmyComponent } from '../_utils/components'
import type { NoticeBarProps } from './props'

import { withInstall } from '../_utils/components'
import _NoticeBar from './NoticeBar.vue'

declare class NoticeBar extends SmyComponent {
  $props: NoticeBarProps
}

export default withInstall(_NoticeBar) as unknown as NoticeBar
