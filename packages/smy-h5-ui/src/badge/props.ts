import { type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  content: [String, Number],
  max: {
    type: [Number, String],
    defualt: 10000,
    validator: (val: string | number) => !Number.isNaN(+val),
  },
  dot: {
    type: Boolean,
    defualt: false,
  },
  bubble: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    defualt: false,
  },
  top: {
    type: [String, Number],
    default: 0,
  },
  right: {
    type: [String, Number],
    default: 0,
  },
  zIndex: {
    type: [String, Number],
    default: undefined,
  },
  color: {
    type: String,
    default: '',
  },
}

export type BadgeProps = ExtractPropTypes<typeof props>
