import { pick } from '../_utils/shared'
import type { PropType } from 'vue'
import { props as loadingProps } from '../loading/props'

export const props = {
  type: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical',
  },
  // common
  stretch: {
    type: Number,
    default: 100,
  },
  // vertical
  isUnMore: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  threshold: {
    type: Number,
    default: 100,
  },
  pulldown: {
    type: Boolean,
    default: true,
  },
  pulldownTxt: {
    type: String,
    default: '下拉刷新',
  },
  loadMoreTxt: {
    type: String,
    default: '上拉加载',
  },
  loadingTxt: {
    type: String,
    default: '加载中...',
  },
  unloadMoreTxt: {
    type: String,
    default: '没有更多了',
  },
  propsTime: {
    type: Number,
    default: 0,
  },
  scrollTo: {
    type: Number,
    default: 1,
  },
  loadingSize: { ...loadingProps.size, default: 'small' },
  loadingType: loadingProps.type,
}
export const VERT_PROP_KEYS = [
  'stretch',
  'isUnMore',
  'isLoading',
  'pulldown',
  'pulldownTxt',
  'loadMoreTxt',
  'loadingTxt',
  'unloadMoreTxt',
  'threshold',
  'propsTime',
  'scrollTo',
  'loadingSize',
  'loadingType',
] as const

type VertPropKeys = typeof VERT_PROP_KEYS[number]

export const vertProps = pick(props, VERT_PROP_KEYS as unknown as VertPropKeys[])
