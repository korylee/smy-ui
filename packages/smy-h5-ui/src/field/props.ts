import { ExtractPropTypes, createComponentProp } from '../_utils/vue/props'
//@ts-ignore
import CloseCircle from '@smy-h5/icons/dist/es/CloseCircle'

export const props = {
  name: String,
  value: [String, Number],
  type: String,
  maxlength: [String, Number],
  rows: [String, Number],
  disabled: Boolean,
  readonly: Boolean,
  placeholder: String,
  autocomplete: Boolean,
  showWordLimit: Boolean,
  autosize: [Boolean, Object],
  clearable: Boolean,
  clearIcon: createComponentProp(() => CloseCircle),
}

export type FieldProps = ExtractPropTypes<typeof props>
