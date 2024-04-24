import { createParentMixin } from '../_mixins/relation'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { computed, defineComponent, unref } from 'vue'

import './steps.less'

const [name, bem] = createNamespace('steps')

export default defineComponent({
  name,
  mixins: [createParentMixin('steps', { children: 'step' })],
  props,
  setup(props, { expose, slots }) {
    const direction = computed(() => (props.vertical ? 'vertical' : 'horizontal'))
    expose({
      direction,
    })
    return () => {
      const { dot, reverse } = props
      return <div class={bem([unref(direction), { dot, reverse }])}>{slots.default?.()}</div>
    }
  },
})
