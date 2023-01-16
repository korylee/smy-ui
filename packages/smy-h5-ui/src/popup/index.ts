import type { PopupProps } from './props'
import type { SmyComponent } from '../_utils/components'

import { withInstall } from '../_utils/components'
import _Popup from './Popup'

declare class Popup extends SmyComponent {
  $props: PopupProps
}

export default withInstall(_Popup) as Popup
