import type { ExtractPropTypes } from '@smy-h5/vtools'
import type { PropType } from 'vue'
import { props as teleportProps } from '../teleport/props'

const POPUP_POSITIONS = ['top', 'bottom', 'center', 'left', 'right'] as const

export type PopupPosition = typeof POPUP_POSITIONS[number]

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
  overlay: {
    type: Boolean,
    default: true,
  },
  overlayClass: [String, Object, Array],
  overlayStyle: [String, Object, Array],
  contentClass: [String, Object, Array],
  contentStyle: [String, Object, Array],
  lockScroll: {
    type: Boolean,
    default: true,
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true,
  },
  teleport: teleportProps.to.type,
}

export type PopupProps = ExtractPropTypes<typeof props>
