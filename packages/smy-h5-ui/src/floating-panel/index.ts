import { SmyComponent } from '../_utils/smy/component'
import { withInstall } from '../_utils/vue/component'
import _FloatingPanel from './FloatingPanel.vue'
import { FloatingPanelProps } from './props'

export declare interface SmyFloatingPanel extends SmyComponent {
  new (): {
    $props: FloatingPanelProps
    $scopedSlots: {
      default: () => any
    }
  }
}

export const FloatingPanel = withInstall(_FloatingPanel) as SmyFloatingPanel

export default FloatingPanel
