import { ExtractPropTypes } from '../_utils/vue/props'

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
}

export type FieldProps = ExtractPropTypes<typeof props>
