import type { PropType } from 'vue'
import { pick } from '../_utils/shared'
import { props as swiperProps } from '../swiper/props'
import { props as popupProps } from '../popup/props'
import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  show: {
    type: Boolean,
    defualt: false,
  },
  images: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  zoom: {
    type: [String, Number],
    default: 2,
  },
  closeable: {
    type: Boolean,
    default: false,
  },
  ...pick(swiperProps, ['loop', 'autoplay', 'initialIndex', 'indicator']),
  ...pick(popupProps, ['lockScroll', 'teleport']),
}

export type ImagePreviewProps = ExtractPropTypes<typeof props>
