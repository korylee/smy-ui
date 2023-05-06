import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: [String, Number, Boolean],
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: { type: [String, Number], default: 12 },
  activeColor: {
    type: String,
    default: '',
  },
  inactiveColor: {
    type: String,
    default: '',
  },
  activeLabel: {
    type: String,
    default: '',
  },
  inactiveLabel: {
    type: String,
    default: '',
  },
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
  loadingSize: [String, Number],
}

export type SwtichProps = ExtractPropTypes<typeof props>
