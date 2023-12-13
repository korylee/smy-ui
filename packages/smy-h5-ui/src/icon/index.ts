import type { SmyComponent } from '../_utils/smy/component'
import type { IconProps } from './props'
import { type VNode } from 'vue'

import { withInstall } from '../_utils/vue/component'
import _Icon from './Icon.jsx'
import { IconCache } from './utils'

declare interface SmyIcon extends SmyComponent {
  new (): {
    $props: IconProps
    $scopedSlots: {
      default: () => VNode
    }
  }
}

const Icon = withInstall(_Icon) as unknown as SmyIcon & { use: typeof IconCache.use }

Icon.use = IconCache.use

export default Icon
