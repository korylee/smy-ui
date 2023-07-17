import { ExtractPropTypes, createNumericProp, createStringProp, numericProp, unknownProp } from '../_utils/vue/props'

export const props = {
  value: {
    type: unknownProp,
    default: false,
  },
  disabled: Boolean,
  size: createNumericProp(12),
  activeColor: createStringProp(''),
  inactiveColor: createStringProp(''),
  activeLabel: createStringProp(''),
  inactiveLabel: createStringProp(''),
  activeValue: {
    type: unknownProp,
    default: true,
  },
  inactiveValue: {
    type: unknownProp,
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
