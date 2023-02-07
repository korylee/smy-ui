import type { SmyComponent } from '../_utils/smy/component'
import type { IconProps } from './props'

import { withInstall } from '../_utils/vue/component'
import _Icon from './Icon'

declare interface SmyIcon extends SmyComponent {
  new (): {
    $props: IconProps
  }
}

export default withInstall(_Icon) as unknown as SmyIcon
