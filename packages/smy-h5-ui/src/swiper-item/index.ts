import { withInstall } from '../_utils/components'
import _SwiperItem from './SwiperItem.vue'

import type { SmyCompoent } from '../_utils/components'

declare class SwiperItem extends SmyCompoent {}

const SmySwiperItem = withInstall(_SwiperItem) as unknown as SwiperItem

export default SmySwiperItem
