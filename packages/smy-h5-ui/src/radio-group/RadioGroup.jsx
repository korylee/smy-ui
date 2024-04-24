import { createParentMixin } from '../_mixins/relation'
import { createNamespace } from '../_utils/vue/create'
import { RADIO_KEY } from './shared'
import { props } from './props'
import { defineComponent, watch } from 'vue'

import './radioGroup.less'

const [name, bem] = createNamespace('radio-group')

export default defineComponent({
  name,
  mixins: [createParentMixin(RADIO_KEY)],
  props,
  setup(props, { emit, expose, slots }) {
    watch(
      () => props.value,
      (val) => {
        emit('change', val)
      },
    )
    expose({
      updateValue: (value) => {
        emit('input', value)
      },
    })

    return () => (
      <div class={bem([props.direction])} role="radiogroup">
        {slots.default?.()}
      </div>
    )
  },
})
