import { type ExtractPropTypes, createNumericProp, truthProp } from '../_utils/vue/props'

export const props = {
  width: createNumericProp(window.innerWidth),
  height: createNumericProp(0),
  vertical: {
    type: Boolean,
    default: false,
  },
  indicator: {
    type: Boolean,
    default: false,
  },
  loop: truthProp,
  duration: createNumericProp(500),
  autoplay: createNumericProp(0),
  initialIndex: createNumericProp(0),
  touchable: truthProp,
  center: {
    type: Boolean,
    default: false,
  },
  isPreventDefault: truthProp,
  isStopPropagation: truthProp,
}

export type SwiperProps = ExtractPropTypes<typeof props>
