import {
  createNumericProp,
  truthProp,
  type ExtractPropTypes,
  createComponentProp,
  numericProp,
} from '../_utils/vue/props'
// @ts-ignore
import Plus from '@smy-h5/icons/dist/es/Plus'
// @ts-ignore
import Minus from '@smy-h5/icons/dist/es/Minus'

export const props = {
  value: {
    type: numericProp,
    required: true,
  },
  min: createNumericProp(0),
  max: createNumericProp(Infinity),
  step: createNumericProp(1),
  readonly: Boolean,
  disabled: Boolean,
  integer: Boolean,
  disabledPlus: Boolean,
  disabledMinus: Boolean,
  showPlus: truthProp,
  showMinus: truthProp,
  showInput: truthProp,
  longPress: truthProp,
  allowEmpty: Boolean,
  placeholder: String,
  decimalPlaces: numericProp,
  width: [String, Number],
  height: [String, Number],
  buttonWidth: numericProp,
  buttonSize: numericProp,
  plusIcon: createComponentProp(Plus),
  minusIcon: createComponentProp(Minus),
}

export type StepperProps = ExtractPropTypes<typeof props>
