import { ExtractPropTypes, truthProp } from '../_utils/vue/props'
import type { PropType } from 'vue'

const POPUP_POSITIONS = ['top', 'bottom', 'center', 'left', 'right'] as const

export type PopupPosition = (typeof POPUP_POSITIONS)[number]

export const props = {
  show: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String as PropType<PopupPosition>,
    default: 'center',
    validator: (str: PopupPosition) => POPUP_POSITIONS.includes(str),
  },
  transition: String,
  overlay: truthProp,
  wrapperClass: [String, Object, Array],
  overlayClass: [String, Object, Array],
  overlayStyle: [String, Object, Array],
  contentClass: [String, Object, Array],
  contentStyle: [String, Object, Array],
  lockScroll: truthProp,
  closeOnClickOverlay: truthProp,
  teleport: String,
}

export type PopupProps = ExtractPropTypes<typeof props>
