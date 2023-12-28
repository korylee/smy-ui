import { PropType } from 'vue'
import { ExtractPropTypes, createStringProp, numericProp, unknownProp } from '../_utils/vue/props'
import { CheckerDirection } from '../checkbox/props'
import { RadioShape } from '../radio/props'

export const props = {
  shape: createStringProp<RadioShape>('round'),
  disabled: Boolean,
  size: numericProp,
  color: String,
  direction: String as PropType<CheckerDirection>,
  value: unknownProp,
}

export type RadioGroupProps = ExtractPropTypes<typeof props>
