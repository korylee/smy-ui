import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { TabProps } from './props'
import _Tab from './Tab.vue'

declare interface SmyTab extends SmyComponent {
  new (): {
    $props: TabProps
    $scopeSlots: {
      default: () => any
      title: () => any
    }
    $emit: {
      (event: 'rendered', data: any): void
    }
  }
}

export const Tab = withInstall(_Tab) as SmyTab

export default Tab
