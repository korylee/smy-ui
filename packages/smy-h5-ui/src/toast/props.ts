import { ExtractPropTypes, componentProp, createNumericProp } from '../_utils/vue/props'
import type { PropType } from 'vue'
import { props as loadingProps } from '../loading/props'
import { popupSharedProps } from '../popup/shared'
import { assign } from '../_utils/shared'

export const TOAST_TYPES = ['loading', 'success', 'warning', 'info', 'error'] as const
export type ToastType = (typeof TOAST_TYPES)[number]

export const TOAST_POSITIONS = ['top', 'center', 'bottom'] as const
export type ToastPosition = (typeof TOAST_POSITIONS)[number]

export const TOAST_ICON_POSITIONS = ['top', 'bottom', 'left', 'right'] as const
export type ToastIconPosition = (typeof TOAST_ICON_POSITIONS)[number]

const popupInheritProps = assign({}, popupSharedProps, {
  closeOnClickOverlay: Boolean,
})

export const props = assign(
  {
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
    duration: createNumericProp(3000),
    // 是否禁止点击背景
    forbidClick: {
      type: Boolean,
      default: false,
    },
    loadingType: loadingProps.type,
    icon: componentProp,
    iconSize: createNumericProp(30),
    iconPosition: {
      type: String as PropType<ToastIconPosition>,
      default: 'top',
      validator: (position: ToastIconPosition) => TOAST_ICON_POSITIONS.includes(position),
    },
    closeOnClick: Boolean,
  },
  popupInheritProps,
)

export type ToastProps = ExtractPropTypes<typeof props>
