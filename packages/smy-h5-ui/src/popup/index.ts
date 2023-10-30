import type { PopupProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'
import { type VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _Popup from './Popup.vue'

declare interface SmyPopup extends SmyComponent {
  new (): {
    $props: PopupProps
    $emit: {
      (event: 'open'): void
      (event: 'opened'): void
      (event: 'close'): void
      (event: 'closed'): void
      (event: 'route-change'): void
      (event: 'click-overlay'): void
      (event: 'update:show', data: boolean): void
    }
    $scopeSlots: {
      default: () => VNode
    }
  }
}

export const popupListeners = [
  'click-overlay',
  'open',
  'opened',
  'close',
  'closed',
  'route-change',
  'update:show',
] as const

export default withInstall(_Popup) as SmyPopup
