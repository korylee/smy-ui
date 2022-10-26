export type { CardProps } from './props'

import Card from './Card.vue'
import { createInstall } from '../_utils/components'

Card.install = createInstall(Card)
export const _CardComponent = Card

export default Card
