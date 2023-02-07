import { type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: Boolean,
    default: false,
  },
  pullingText: {
    type: String,
    default: '下拉刷新'
  },
  loosingText: {
    type: String,
    default: '释放刷新'
  },
  loadingText: {
    type: String,
    default: '加载中...'
  },
  headerHeight: {
    type: [String, Number],
    default: 50
  },
  pullDistance: {
    type: [String, Number],
    default: 50
  },
  duration: {
    type: [String, Number],
    default: 0.3
  }
}

export type PullRefreshProps = ExtractPropTypes<typeof props>
