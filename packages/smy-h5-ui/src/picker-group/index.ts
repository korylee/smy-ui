import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _PickerGroup from './PickerGroup'
import { PickerGroupProps } from './props'

declare class SmyPickerGroup extends SmyComponent {
  new(): {
    $props: PickerGroupProps
    $scopedSlots: {
      default: () => any
    }
    $emit: {
      (event: 'open'): void
      (event: 'opened'): void
      (event: 'close'): void
      (event: 'closed'): void
      (event: 'route-change'): void
      (event: 'click-overlay'): void
    }
  }
}

export default withInstall(_PickerGroup) as SmyPickerGroup
