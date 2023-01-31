import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'
import _SwiperItem from './SwiperItem.vue'

declare class SmySwiperItem extends SmyComponent {
  $props: Record<string, never>
}

export default withInstall(_SwiperItem) as SmySwiperItem
