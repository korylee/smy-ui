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
    direction({ vertical }) {
      return vertical ? 'vertical' : 'horizontal'
    },
  },
  render() {
    const vm = this
    const { direction, progressDot: dot } = vm

    return <div class={bem({ dot, [direction]: direction })}>{getSlot(vm)}</div>
  },
}
