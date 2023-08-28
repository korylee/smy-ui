import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Tabs from './Tabs.vue'
import { TabsProp } from './props'

declare interface SmyTabs extends SmyComponent {
  new (): {
    $props: TabsProp
    $scopeSlots: {
      'nav-left': () => any
      'nav-right': () => any
      'nav-bottom': () => any
      default: () => any
    }
    $emit: {
      (event: 'change', data: any): void
      (event: 'update:active', data: any): void
    }
  }
}

export default withInstall(_Tabs) as SmyTabs
