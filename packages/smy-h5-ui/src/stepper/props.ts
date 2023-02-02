import { type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  simple: {
    type: Boolean,
    default: true,
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
  transition: {
    type: Boolean,
    default: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  decimalPlaces: {
    type: Number,
    default: 0,
  },
}

export type StepperProps = ExtractPropTypes<typeof props>
