import { type ExtractPropTypes, createNumericProp, truthProp, numericProp } from '../_utils/vue/props'

export const props = {
  width: numericProp,
  height: numericProp,
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
