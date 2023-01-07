import type { SmyComponent } from '../_utils/components'
import type { IconProps } from './props'

import { withInstall } from '../_utils/components'
import _Icon from './Icon'

declare class SmyIcon extends SmyComponent {
  $props: IconProps
}

export default withInstall(_Icon) as unknown as SmyIcon
