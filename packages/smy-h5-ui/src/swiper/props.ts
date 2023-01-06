import type { ExtractPropTypes } from '@smy-h5/vtools'
import type { PropType } from 'vue'

const SWIPER_DIRECTIIONS = ['vertical', 'horizontal'] as const

type SwiperDirection = typeof SWIPER_DIRECTIIONS[number]

export const props = {
  width: {
    type: [Number, String],
    default: window.innerWidth,
  },
  height: {
    type: [Number, String],
    default: 0,
  },
  direction: {
    type: String as PropType<SwiperDirection>,
    default: 'horizontal',
    validator: (val: SwiperDirection) => SWIPER_DIRECTIIONS.includes(val),
  },
  indicator: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: [String, Number],
    default: 500,
  },
  autoplay: {
    type: [Number, String],
    default: 0,
  },
  initialIndex: {
    type: [Number, String],
    default: 0,
  },
  touchable: {
    type: Boolean,
    default: true,
  },
  center: {
    type: Boolean,
    default: false,
  },
  isPreventDefault: {
    type: Boolean,
    default: true,
  },
  isStopPropagation: {
    type: Boolean,
    default: true,
  },
}

export type SwiperProps = ExtractPropTypes<typeof props>
