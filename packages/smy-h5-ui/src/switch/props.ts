import { ExtractPropTypes, createNumericProp, createStringProp, numericProp } from '../_utils/vue/props'

export const props = {
  value: {
    type: [String, Number, Boolean],
    default: false,
  },
  disabled: Boolean,
  size: createNumericProp(12),
  activeColor: createStringProp(''),
  inactiveColor: createStringProp(''),
  activeLabel: createStringProp(''),
  inactiveLabel: createStringProp(''),
  activeValue: {
    type: [Number, String, Boolean],
    default: true,
  },
  inactiveValue: {
    type: [Number, String, Boolean],
    default: false,
  },
  loading: Boolean,
  loadingColor: String,
  loadingSize: numericProp,
  isStopPropagation: {
    type: Boolean,
    default: true,
  },
}

export type SwtichProps = ExtractPropTypes<typeof props>
