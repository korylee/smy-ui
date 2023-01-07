import type { ExtractPropTypes } from '@smy-h5/vtools'

export const props = {
  width: {
    type: [Number, String],
    default: window.innerWidth,
  },
  height: {
    type: [Number, String],
    default: 0,
  },
  vertical: {
    type: Boolean,
    default: false,
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
