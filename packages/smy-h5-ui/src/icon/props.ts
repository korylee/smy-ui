import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  name: {
    type: String,
  },
  size: [String, Number],
  color: String,
  tag: { type: String, default: 'span' },
  namespace: {
    type: String,
    default: 'smy-icon',
  },
  transition: {
    type: [Number, String],
    default: 0,
  },
}

export type IconProps = ExtractPropTypes<typeof props>
