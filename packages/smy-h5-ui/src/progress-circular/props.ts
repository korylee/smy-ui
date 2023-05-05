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
  color: {
    type: String,
    default: 'currentColor',
  },
  bgColor: String,
  rotate: {
    type: [Number, String],
    default: 0,
  },
  indeterminate: [Boolean, String] as PropType<boolean | 'disable-shrink'>,
  size: {
    type: [Number, String],
    default: '1em',
  },
  width: {
    type: [Number, String],
    default: 2,
  },
}

export type ProgressCircularProps = ExtractPropTypes<typeof props>
