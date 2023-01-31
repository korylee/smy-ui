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
    default: '加载中...',
  },
  loadMoreText: {
    type: String,
    default: '哎呀，这里是底部了啦',
  },
  useCapture: {
    type: Boolean,
    default: false,
  },
}

export type ScrollerProps = ExtractPropTypes<typeof props>
