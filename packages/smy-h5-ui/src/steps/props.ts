import type { ExtractPropTypes } from '@smy-h5/vtools'

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
