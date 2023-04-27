import type { ExtractPropTypes } from '../_utils/vue/props'
import type { PropType } from 'vue'
import { props as loadingProps } from '../loading/props'

export const TOAST_TYPES = ['loading', 'success', 'warning', 'info', 'error'] as const
export type ToastType = typeof TOAST_TYPES[number]

export const TOAST_POSITIONS = ['top', 'center', 'bottom'] as const
export type ToastPosition = typeof TOAST_POSITIONS[number]

export const props = {
  type: {
    type: String as PropType<ToastType>,
    validator: (type: ToastType) => TOAST_TYPES.includes(type),
  },
  // 显示的位置
  position: {
    type: String as PropType<ToastPosition>,
    default: 'top',
    validator: (position: ToastPosition) => TOAST_POSITIONS.includes(position),
  },
  content: String,
  contentClass: [String, Object, Array],
  // 持续时间
  duration: {
    type: Number,
    default: 3000,
  },
  // 横版样式
  vertical: {
    type: Boolean,
    default: false,
  },
  // 是否禁止滚动穿透
  lockScroll: {
    type: Boolean,
    default: false,
  },
  // 显示还是隐藏
  show: {
    type: Boolean,
    default: false,
  },
  teleport: {
    type: String,
    default: 'body',
  },
  // 是否禁止点击背景
  forbidClick: {
    type: Boolean,
    default: false,
  },
  customUpdate: {
    type: String,
  },
  loadingType: loadingProps.type,
  loadingSize: { type: loadingProps.size.type, default: '1.4em' },
  action: [String, Function, Object],
}

export type ToastProps = ExtractPropTypes<typeof props>
