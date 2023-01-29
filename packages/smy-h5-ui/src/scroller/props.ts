import { type ExtractPropTypes } from '@smy-h5/vtools'

export const props = {
  value: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
  threshold: {
    type: Number,
    default: 200,
  },
  loadText: {
    type: String,
    default: '',
  },
  loadMoreText: {
    type: String,
    default: '',
  },
  useCapture: {
    type: Boolean,
    default: false,
  },
}

export type ScrollerProps = ExtractPropTypes<typeof props>
