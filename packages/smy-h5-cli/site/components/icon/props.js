export const props = {
  name: {
    type: String,
  },
  size: [String, Number],
  color: String,
  tag: { type: String, default: 'span' },
  namespace: {
    type: String,
    default: 'smy-site-icon',
  },
  transition: {
    type: [Number, String],
    default: 0,
  },
}
