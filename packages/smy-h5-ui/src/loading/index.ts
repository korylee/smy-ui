import type { LoadingProps } from './props'
import type { SmyComponent } from '../_utils/components'

import _Loading from './Loading.vue'
import { withInstall } from '../_utils/components'

declare class SmyLoading extends SmyComponent {
  $props: LoadingProps
}

export default withInstall(_Loading) as unknown as SmyLoading
