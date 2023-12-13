import type { LoadingProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'
import type { VNode } from 'vue'

import _Loading from './Loading.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyLoading extends SmyComponent {
  new (): {
    $props: LoadingProps
    $scopedSlots: {
      default: () => VNode
      desc: () => VNode
    }
  }
}

export default withInstall(_Loading) as unknown as SmyLoading
