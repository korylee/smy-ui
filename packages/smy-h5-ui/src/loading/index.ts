export type { LoadingProps } from './props'

import Loading from './Loading.vue'
import { createInstall } from '../_utils/components'

Loading.install = createInstall(Loading)

export const _LoadingComponent = Loading

export default Loading
