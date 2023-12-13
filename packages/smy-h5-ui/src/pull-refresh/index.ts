import { type SmyComponent } from '../_utils/smy/component'
import { type PullRefreshProps } from './props'
import { type VNode } from 'vue'

import _PullRefresh from './PullRefresh.vue'
import { withInstall } from '../_utils/vue/component'

type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling'
interface SmyPullRefresh extends SmyComponent {
  new (): {
    $props: PullRefreshProps
    $scopedSlots: {
      default: () => VNode
      header: (data: { status: PullRefreshStatus; distance: number }) => VNode
    }
    $emit: {
      (event: 'input', data: true): void
      (event: 'refresh'): void
      (event: 'change', data: { status: PullRefreshStatus; distance: number }): void
    }
  }
}

export default withInstall(_PullRefresh) as SmyPullRefresh
