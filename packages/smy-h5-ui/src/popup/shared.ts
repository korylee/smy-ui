import { keys } from '../_utils/shared'
import { truthProp } from '../_utils/vue/props'

export const popupListeners = [
  'click-overlay',
  'open',
  'opened',
  'close',
  'closed',
  'route-change',
  'update:show',
] as const

export const popupSharedProps = {
  show: {
    type: Boolean,
    default: false,
  },
  overlay: truthProp,
  overlayClass: [String, Object, Array],
  overlayStyle: [String, Object, Array],
  lockScroll: truthProp,
  closeOnClickOverlay: truthProp,
  teleport: String,
}

export const popupSharedPropKeys = keys(popupSharedProps)
