import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  vertical: {
    type: Boolean,
    default: false,
  },
  current: {
    type: [String, Number],
    default: 0,
  },
  progressDot: {
    type: Boolean,
    defualt: false,
  },
  reverse: { type: Boolean, default: false },
}

export type StepsProps = ExtractPropTypes<typeof props>
