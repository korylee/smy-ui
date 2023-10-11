import { PropType } from 'vue'
import { ExtractPropTypes, createComponentProp, createStringProp, numericProp } from '../_utils/vue/props'
//@ts-ignore
import CloseCircle from '@smy-h5/icons/dist/es/CloseCircle'
import { FieldAutosize } from './utils'

type FieldClearTrigger = 'always' | 'focus'

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
  autofocus: Boolean,
  enterkeyhint: String,
  spellcheck: Boolean,
  autocorrect: String,
  autocapitalize: String,
  showWordLimit: Boolean,
  autosize: [Boolean, Object] as PropType<boolean | FieldAutosize>,
  clearable: Boolean,
  clearIcon: createComponentProp(CloseCircle),
  clearTrigger: createStringProp<FieldClearTrigger>('always'),
}

export type FieldProps = ExtractPropTypes<typeof props>
