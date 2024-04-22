import { type SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Badge from './Badge.vue'
import { type BadgeProps } from './props'

interface SmyBadge extends SmyComponent {
  new (): {
    $props: BadgeProps
  }
}

export const Badge = withInstall(_Badge) as SmyBadge

export default Badge
