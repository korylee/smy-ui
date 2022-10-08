import Card from './Card.vue'
import { withInstall } from '../_utils/components'
export type { CardProps } from './props'

withInstall(Card)
export const _CardComponent = Card

export default Card
