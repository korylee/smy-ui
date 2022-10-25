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
