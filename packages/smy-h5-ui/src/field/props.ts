import { PropType } from 'vue'
import { ExtractPropTypes, createComponentProp, numericProp } from '../_utils/vue/props'
//@ts-ignore
import CloseCircle from '@smy-h5/icons/dist/es/CloseCircle'
import { FieldAutosize } from './utils'

export const props = {
  name: String,
  value: numericProp,
  type: String,
  maxlength: numericProp,
  rows: numericProp,
  disabled: Boolean,
  readonly: Boolean,
  placeholder: String,
  autocomplete: Boolean,
  showWordLimit: Boolean,
  autosize: [Boolean, Object] as PropType<boolean | FieldAutosize>,
  clearable: Boolean,
  clearIcon: createComponentProp(() => CloseCircle),
}

export type FieldProps = ExtractPropTypes<typeof props>
