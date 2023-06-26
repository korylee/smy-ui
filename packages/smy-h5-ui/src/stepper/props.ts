import { createNumericProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: [String, Number],
    required: true,
  },
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
}

export type StepperProps = ExtractPropTypes<typeof props>
