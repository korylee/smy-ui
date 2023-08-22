import { createNumericProp, truthProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: [String, Number],
    required: true,
  },
  min: createNumericProp(0),
  max: createNumericProp(Infinity),
  step: createNumericProp(1),
  readonly: Boolean,
  disabled: Boolean,
  disabledPlus: Boolean,
  disabledMinus: Boolean,
  longPress: truthProp,
  placeholder: String,
  decimalPlaces: createNumericProp(0),
  width: [String, Number],
  height: [String, Number],
  buttonWidth: [String, Number],
  buttonSize: [String, Number],
}

export type StepperProps = ExtractPropTypes<typeof props>
