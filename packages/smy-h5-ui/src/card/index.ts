import type { CardProps } from './props'
import type { SmyComponent } from '../_utils/smy/component'

import _Card from './Card.vue'
import { withInstall } from '../_utils/vue/component'

declare class SmyCard extends SmyComponent {
  $props: CardProps
}

export default withInstall(_Card) as SmyCard
