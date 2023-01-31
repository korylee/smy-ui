import type { ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  price: {
    type: [Number, String],
    default: 0,
  },
  needSymbol: {
    type: Boolean,
    defualt: true,
  },
  decimalDigits: {
    type: [Number, String],
    default: 2,
  },
  thousands: {
    type: Boolean,
    default: false,
  },
}

export type PriceProps = ExtractPropTypes<typeof props>
