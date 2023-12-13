import type { SmyComponent } from '../_utils/smy/component'
import type { LazyProps } from './props'
import { type VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import Lazy from './Lazy.jsx'

declare interface SmyLazy extends SmyComponent {
  new (): {
    $props: LazyProps
    $scopedSlots: {
      default: (data: { value: boolean }) => VNode
    }
    $emit: {
      (event: 'input', val: boolean): void
    }
  }
}

export default withInstall(Lazy) as SmyLazy
