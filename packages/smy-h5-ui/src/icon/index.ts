import type { SmyComponent } from '../_utils/smy/component'
import type { IconProps } from './props'

import { withInstall } from '../_utils/vue/component'
import _Icon from './Icon'

declare class SmyIcon extends SmyComponent {
  $props: IconProps
}

export default withInstall(_Icon) as unknown as SmyIcon
