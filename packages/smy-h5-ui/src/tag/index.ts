import type { SmyComponent } from '../_utils/components'
import type { TagProps } from './props'

import { withInstall } from '../_utils/components'
import _Tag from './Tag.vue'

declare class SmyTag extends SmyComponent {
  $props: TagProps
}

export default withInstall(_Tag) as unknown as SmyTag
