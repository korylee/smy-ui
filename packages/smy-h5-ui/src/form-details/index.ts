import { withInstall } from '../_utils/vue/component'
import _FormDetails from './FormDetails.vue'
import { SmyComponent } from '../_utils/smy/component'
import { FormDetailsProps } from './props'
import { VNode } from 'vue'

declare interface SmyFormDetails extends SmyComponent {
  new (): {
    $props: FormDetailsProps
    $scopeSlots: {
      'error-message': () => VNode
      'extra-message': () => VNode
    }
  }
}

export default withInstall(_FormDetails) as SmyFormDetails
