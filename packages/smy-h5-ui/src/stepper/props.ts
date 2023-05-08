import { type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: [String, Number],
    required: true,
  },
  min: {
    type: [Number, String],
    default: 0,
  },
  max: {
    type: [Number, String],
    default: Infinity,
  },
  step: {
    type: [Number, String],
    default: 1,
  },
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
  decimalPlaces: {
    type: [Number, String],
    default: 0,
  },
  width: [String, Number],
  height: [String, Number],
  buttonWidth: [String, Number],
  buttonSize: [String, Number],
}

export type StepperProps = ExtractPropTypes<typeof props>
