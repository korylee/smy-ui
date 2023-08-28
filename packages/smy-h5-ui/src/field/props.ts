import { ExtractPropTypes, createStringProp } from '../_utils/vue/props'

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
  clearIcon: createStringProp('close-circle'),
}

export type FieldProps = ExtractPropTypes<typeof props>
