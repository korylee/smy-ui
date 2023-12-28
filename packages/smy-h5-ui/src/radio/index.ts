import { VNode } from 'vue'
import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Radio from './Radio'
import { RadioProps } from './props'

declare interface SmyRadio extends SmyComponent {
  new (): {
    $props: RadioProps
    $scopedSlots: {
      icon: () => VNode
      default: () => VNode
    }
    $emit: {
      (event: 'input', data: boolean): void
    }
  }
}

export default withInstall(_Radio) as SmyRadio
