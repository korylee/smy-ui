import type { PopupProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'
import _Popup from './Popup'

declare interface Popup extends SmyComponent {
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
  }
}

export default withInstall(_Popup) as Popup
