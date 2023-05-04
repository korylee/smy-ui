import { type PropType } from 'vue'
import { type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: [Number, String],
    default: 0,
  },
  tag: {
    type: String,
    default: 'div',
  },
  bgColor: String,
  color: String,
  rotate: {
    type: [Number, String],
    default: 0,
  },
  indeterminate: [Boolean, String] as PropType<boolean | 'disable-shrink'>,
  size: {
    type: [Number, String],
    default: 32,
  },
  width: {
    type: [Number, String],
    default: 4,
  },
}

export type ProgressCircularProps = ExtractPropTypes<typeof props>
