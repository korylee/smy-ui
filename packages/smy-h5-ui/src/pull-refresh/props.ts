import { createNumericProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: Boolean,
    default: false,
  },
  pullingText: {
    type: String,
    default: '下拉刷新',
  },
  loosingText: {
    type: String,
    default: '释放刷新',
  },
  loadingText: {
    type: String,
    default: '加载中...',
  },
  headerHeight: createNumericProp(50),
  pullDistance: createNumericProp(50),
  duration: createNumericProp(300),
}

export type PullRefreshProps = ExtractPropTypes<typeof props>
