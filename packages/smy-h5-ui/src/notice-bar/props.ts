export const props = {
  text: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
  wrapable: {
    type: Boolean,
    default: false,
  },
  delay: {
    type: [String, Number],
    default: 1,
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
  speed: {
    type: Number,
    default: 50,
  },
}
