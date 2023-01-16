import type { SmyComponent } from '../_utils/components'
import type { PriceProps } from './props'

import { withInstall } from '../_utils/components'
import _Price from './Price.vue'

declare class SmyPrice extends SmyComponent {
  $props: PriceProps
}

export default withInstall(_Price) as unknown as SmyPrice
