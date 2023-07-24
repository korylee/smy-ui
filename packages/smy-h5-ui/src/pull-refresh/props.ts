import { createNumericProp, createStringProp, numericProp, type ExtractPropTypes } from '../_utils/vue/props'

export const DEFAULT_HEAD_HEIGHT = 50

export const props = {
  modelValue: {
    type: Boolean,
    default: false,
  },
  disabled: Boolean,
  pullingText: createStringProp('下拉刷新'),
  loosingText: createStringProp('释放刷新'),
  loadingText: createStringProp('加载中...'),
  headerHeight: createNumericProp(DEFAULT_HEAD_HEIGHT),
  pullDistance: numericProp,
  duration: createNumericProp(300),
}

export type PullRefreshProps = ExtractPropTypes<typeof props>
