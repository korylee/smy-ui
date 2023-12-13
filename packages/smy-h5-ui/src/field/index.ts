import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Field from './Field.vue'
import { FieldProps } from './props'

interface SmyField extends SmyComponent {
  new (): {
    $props: FieldProps
    // $scopedSlots: {}
  }
}

export default withInstall(_Field) as SmyField
