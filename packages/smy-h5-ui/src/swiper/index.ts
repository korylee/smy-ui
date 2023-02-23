import type { SmyComponent } from '../_utils/smy/component'
import type { SwiperProps } from './props'
import { type VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _Swiper from './Swiper.vue'

declare interface SmySwiper extends SmyComponent {
  new (): {
    $props: SwiperProps
    $scopeSlots: {
      indicator: (data: { index: number; length: number }) => VNode
      default: () => VNode
      extra: () => VNode
    }
    $emit: {
      (event: 'change', index: number): void
    }
  }
}
export default withInstall(_Swiper) as unknown as SmySwiper
