import type { PopupProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'
import _Popup from './Popup'

declare class Popup extends SmyComponent {
  $props: PopupProps
}

export default withInstall(_Popup) as Popup
