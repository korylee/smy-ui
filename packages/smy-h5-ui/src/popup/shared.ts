import { keys } from '../_utils/shared'
import { truthProp } from '../_utils/vue/props'

export type PopupEmit = {
  (event: 'open'): void
  (event: 'opened'): void
  (event: 'close'): void
  (event: 'closed'): void
  (event: 'route-change'): void
  (event: 'click-overlay'): void
  (event: 'update:show', data: boolean): void
}

export type PopupListeners = {
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onClickOverlay?: () => void
}

export const popupListenerKeys = [
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
