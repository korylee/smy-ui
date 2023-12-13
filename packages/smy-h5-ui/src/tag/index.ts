import type { TagProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import { withInstall } from '../_utils/vue/component'
import _Tag from './Tag.vue'

declare interface SmyTag extends SmyComponent {
  new (): {
    $props: TagProps
  }
}

export default withInstall(_Tag) as unknown as SmyTag
