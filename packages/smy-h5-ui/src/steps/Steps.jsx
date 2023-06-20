import { getSlot } from '../_utils/vue/slots'
import { createParentMixin } from '../_mixins/relation'
import { props } from './props'

import './steps.less'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('steps')

export default {
  name,
  mixins: [createParentMixin('steps', { children: 'step' })],
  props,
  computed: {
    classes({ direction, progressDot: dot }) {
      return bem({ dot, [direction]: direction })
    },
    direction({ vertical }) {
      return vertical ? 'vertical' : 'horizontal'
    },
  },
  render() {
    const vm = this
    return <div class={vm.classes}>{getSlot(vm)}</div>
  },
}
