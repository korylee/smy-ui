import type { SmyComponent } from '../_utils/components'
import type { SwiperProps } from './props'

import { withInstall } from '../_utils/components'
import _Swiper from './Swiper.vue'

declare class Swiper extends SmyComponent {
  $props: SwiperProps
}

export default withInstall(_Swiper) as unknown as Swiper
