import { createNumericProp, createStringProp, type ExtractPropTypes } from '../_utils/vue/props'

export const props = {
  value: {
    type: Boolean,
    default: false,
  },
  pullingText: createStringProp('下拉刷新'),
  loosingText: createStringProp('释放刷新'),
  loadingText: createStringProp('加载中...'),
  headerHeight: createNumericProp(50),
  pullDistance: createNumericProp(50),
  duration: createNumericProp(300),
}

export type PullRefreshProps = ExtractPropTypes<typeof props>
