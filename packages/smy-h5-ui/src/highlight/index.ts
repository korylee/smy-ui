import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _Highlight from './Highlight'
import { HighLightProps } from './props'

export interface SmyHighlight extends SmyComponent {
  new (): {
    $props: HighLightProps
    $scopedSlots: {
      highlight: (data: { text: string }) => any
      unhighlight: (data: { text: string }) => any
    }
  }
}

export default withInstall(_Highlight) as SmyHighlight
