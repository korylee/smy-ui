import type { LoadingProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import _Loading from './Loading.vue'
import { withInstall } from '../_utils/vue/component'

declare class SmyLoading extends SmyComponent {
  $props: LoadingProps
}

export default withInstall(_Loading) as unknown as SmyLoading
