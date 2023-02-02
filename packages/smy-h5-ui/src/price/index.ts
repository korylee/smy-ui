import type { SmyComponent } from '../_utils/smy/component'
import type { PriceProps } from './props'

import { withInstall } from '../_utils/vue/component'
import _Price from './Price.vue'

declare interface SmyPrice extends SmyComponent {
  new (): {
    $props: PriceProps
  }
}

export default withInstall(_Price) as unknown as SmyPrice
