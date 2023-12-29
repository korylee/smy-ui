import type { PopupProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'
import { type VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _Popup from './Popup.vue'
import { PopupEmit } from './shared'

declare interface SmyPopup extends SmyComponent {
  new (): {
    $props: PopupProps
    $emit: PopupEmit
    $scopedSlots: {
      default: () => VNode
    }
  }
}

export default withInstall(_Popup) as SmyPopup
