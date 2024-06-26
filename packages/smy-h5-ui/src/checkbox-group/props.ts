import { PropType } from 'vue'
import { ExtractPropTypes, createArrayProp, createStringProp, numericProp } from '../_utils/vue/props'
import { CheckboxShape, CheckerDirection } from '../checkbox/props'

export const props = {
  max: numericProp,
  shape: createStringProp<CheckboxShape>('square'),
  disabled: Boolean,
  size: numericProp,
  color: String,
  direction: String as PropType<CheckerDirection>,
  value: createArrayProp<unknown>(),
}

export type CheckboxGroupProps = ExtractPropTypes<typeof props>
