import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { TabsProp } from '../tabs/props'
import _Tabs from './Tab.vue'

declare interface SmyTab extends SmyComponent {
  new (): {
    $props: TabsProp
    $scopeSlots: {
      default: () => any
      title: () => any
    }
    $emit: {
      (event: 'rendered', data: any): void
    }
  }
}

export default withInstall(_Tabs) as SmyTab
