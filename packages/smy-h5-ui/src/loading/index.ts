export type { LoadingProps } from './props'

import Loading from './Loading.vue'
import { withInstall } from '../_utils/components'

withInstall(Loading)

export const _LoadingComponent = Loading

export default Loading
