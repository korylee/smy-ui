import { type ExtractPropTypes } from '@smy-h5/vtools'

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
    // px/s
    type: Number,
    default: 50,
  },
}

export type NoticeBarProps = ExtractPropTypes<typeof props>
