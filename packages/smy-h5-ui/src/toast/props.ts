import { ExtractPropTypes, componentProp, createContainProp, createNumericProp } from '../_utils/vue/props'
import type { PropType } from 'vue'
import { LOADING_TYPES } from '../loading/props'
import { popupSharedProps } from '../popup/shared'
import { assign } from '@smy-h5/shared'

export const TOAST_TYPES = ['loading', 'success', 'warning', 'info', 'error'] as const
export type ToastType = (typeof TOAST_TYPES)[number]

export const TOAST_POSITIONS = ['top', 'center', 'bottom'] as const
export type ToastPosition = (typeof TOAST_POSITIONS)[number]

export const TOAST_ICON_POSITIONS = ['top', 'bottom', 'left', 'right'] as const
export type ToastIconPosition = (typeof TOAST_ICON_POSITIONS)[number]

export type ToastWordBreak = 'break-all' | 'keep-all' | 'break-word' | 'normal'

const popupInheritProps = assign({}, popupSharedProps, {
  closeOnClickOverlay: Boolean,
  overlay: Boolean,
})

export const props = assign(
  {
    type: createContainProp(TOAST_TYPES, false),
    // 显示的位置
    position: createContainProp(TOAST_POSITIONS),
    content: String,
    contentClass: [String, Object, Array],
    // 持续时间
    duration: createNumericProp(3000),
    // 是否禁止点击背景
    forbidClick: {
      type: Boolean,
      default: false,
    },
    loadingType: createContainProp(LOADING_TYPES),
    icon: componentProp,
    iconSize: createNumericProp(30),
    iconPosition: createContainProp(TOAST_ICON_POSITIONS),
    closeOnClick: Boolean,
    wordBreak: String as PropType<ToastWordBreak>,
  },
  popupInheritProps,
)

export type ToastProps = ExtractPropTypes<typeof props>
