import { type SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import Badge from './Badge.vue'
import { type BadgeProps } from './props'

interface SmyBadge extends SmyComponent {
  new (): {
    $props: BadgeProps
  }
}

export default withInstall(Badge) as SmyBadge
