import type { SmyComponent } from '../_utils/components'

import { withInstall } from '../_utils/components'
import _SwiperItem from './SwiperItem.vue'

declare class SmySwiperItem extends SmyComponent {
  $props: Record<string, never>
}

export default withInstall(_SwiperItem) as SmySwiperItem
