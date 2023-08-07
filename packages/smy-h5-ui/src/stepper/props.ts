import { createNumericProp, truthProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  modelValue: {
    type: [String, Number],
    required: true,
  },
  defaultValue: createNumericProp(1),
  min: createNumericProp(0),
  max: createNumericProp(Infinity),
  step: createNumericProp(1),
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledPlus: {
    type: Boolean,
    default: false,
  },
  disabledMinus: {
    type: Boolean,
    default: false,
  },
  decimalPlaces: createNumericProp(0),
  width: [String, Number],
  height: [String, Number],
  buttonWidth: [String, Number],
  buttonSize: [String, Number],
  longPress: truthProp,
}

export type StepperProps = ExtractPropTypes<typeof props>
