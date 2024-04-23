import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

import './cell.less'
import { defineComponent, h } from 'vue'

const [name, bem] = createNamespace('cell')

export default defineComponent({
  name,
  props,
  setup(props, { slots, listeners }) {
    return () => {
      const renderIcon = () => {
        return slots.icon ? h('div', { class: bem('icon') }, [slots.icon()], 2) : null
      }
      const renderTitle = () => {
        const descVNode = slots.desc?.() ?? props.desc
        return (
          <div class={[bem('title'), props.titleClass]}>
            {(slots.title ?? slots.default)?.() ?? props.title}
            {descVNode ? <div class={[bem('desc'), props.descClass]}>{descVNode}</div> : null}
          </div>
        )
      }
      const renderValue = () => {
        const valueVNode = slots.value?.() || props.value
        return valueVNode ? <div class={bem('value')}>{valueVNode}</div> : null
      }
      const renderExtra = () => {
        return slots.extra ? <div class={[bem('extra'), props.extraClass]}>{slots.extra()}</div> : null
      }

      const data = {
        class: bem({
          borderless: !props.border,
          insert: props.insert,
          clickable: props.clickable,
        }),
        on: listeners,
      }
      return h('div', data, [renderIcon(), renderTitle(), renderValue(), renderExtra()])
    }
  },
})
