import { type PropType } from 'vue'
import { createNumericProp, createStringProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: createNumericProp(0),
  tag: createStringProp('div'),
  color: createStringProp('currentColor'),
  bgColor: String,
  rotate: createNumericProp(0),
  indeterminate: [Boolean, String] as PropType<boolean | 'disable-shrink'>,
  size: {
    type: [Number, String],
    default: '1em',
  },
  width: createNumericProp(2),
}

export type ProgressCircularProps = ExtractPropTypes<typeof props>
