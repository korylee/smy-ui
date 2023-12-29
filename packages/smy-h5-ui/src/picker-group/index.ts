import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import { PopupEmit } from '../popup/shared'
import _PickerGroup from './PickerGroup'
import { PickerGroupProps } from './props'

declare class SmyPickerGroup extends SmyComponent {
  new(): {
    $props: PickerGroupProps
    $scopedSlots: {
      default: () => any
    }
    $emit: {
      (event: 'cancel'): void
      (event: 'confirm', data: any[]): void
    } & PopupEmit
  }
}

export default withInstall(_PickerGroup) as SmyPickerGroup
