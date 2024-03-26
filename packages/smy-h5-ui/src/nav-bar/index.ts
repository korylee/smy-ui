import { VNode } from 'vue'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _NavBar from './NavBar'
import { NavBarProps } from './props'

export declare interface SmyNavBar extends SmyComponent {
  new (): {
    $props: NavBarProps
    $scopedSlots: {
      left: () => VNode[]
      right: () => VNode[]
      title: () => VNode[]
    }
    $emit: {
      (name: 'click-left', event: Event): void
      (name: 'click-right', event: Event): void
    }
  }
}

export const NavBar = withInstall(_NavBar) as SmyNavBar

export default NavBar
