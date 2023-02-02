import type { LoadingProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import _Loading from './Loading.vue'
import { withInstall } from '../_utils/vue/component'

declare interface SmyLoading extends SmyComponent {
  new (): {
    $props: LoadingProps
  }
}

export default withInstall(_Loading) as unknown as SmyLoading
