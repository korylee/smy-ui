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
    const { direction, progressDot: dot, reverse } = vm

    return <div class={bem({ dot, [direction]: direction, reverse })}>{vm._t('default')}</div>
  },
}
