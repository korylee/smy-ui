import { withInstall } from '../_utils/components'
import _Swiper from './Swiper.vue'

import type { SmyCompoent } from '../_utils/components'
import type { SwiperProps } from './props'

declare class Swiper extends SmyCompoent {
  $props: SwiperProps
}

const SmySwiper = withInstall(_Swiper) as unknown as Swiper

export default SmySwiper
