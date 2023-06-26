import { ExtractPropTypes, createNumericProp, createStringProp } from '../_utils/vue/props'

export const props = {
  value: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
  threshold: createNumericProp(200),
  loadText: createStringProp('加载中...'),
  loadMoreText: createStringProp('哎呀，这里是底部了啦'),
  useCapture: {
    type: Boolean,
    default: false,
  },
}

export type ScrollerProps = ExtractPropTypes<typeof props>
