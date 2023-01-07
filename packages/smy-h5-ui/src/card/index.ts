import type { CardProps } from './props'
import type { SmyComponent } from '../_utils/components'

import _Card from './Card.vue'
import { withInstall } from '../_utils/components'

declare class SmyCard extends SmyComponent {
  $props: CardProps
}

export default withInstall(_Card) as SmyCard
