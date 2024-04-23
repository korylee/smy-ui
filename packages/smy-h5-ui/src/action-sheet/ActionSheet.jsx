import { createNamespace } from '../_utils/vue/create'
import Popup from '../popup'
import ProgressCircular from '../progress-circular'
import Icon from '../icon'
import { popupInheritPropKeys, props } from './props'
import { popupListenerKeys } from '../popup/shared'
import { assign, pick } from '@smy-h5/shared'
import { HAPTICS_FEEDBACK } from '../_utils/contant'
import { defineComponent, getCurrentInstance, h, nextTick } from 'vue'
import { getListeners } from '../_utils/vue/listener'

import '../_styles/common.less'
import './actionSheet.less'

const [name, bem] = createNamespace('action-sheet')

export default defineComponent({
  name,
  props,
  setup(props, { emit, slots }) {
    const onSelect = (item, index) => {
      const { disabled, loading, callback, closeOnClickAction } = item
      if (disabled || loading) {
        return
      }
      callback?.(item)

      if (closeOnClickAction) {
        emit('update:show', false)
      }

      nextTick(() => emit('select', item, index))
    }
    const onCancel = () => {
      emit('update:show', false)
      emit('cancel')
    }

    return () => {
      const renderHeader = () =>
        props.title
          ? h('div', { class: bem('header') }, [
              props.title,
              props.closeable &&
                h(Icon, {
                  attrs: { name: props.closeIcon },
                  class: bem('close', HAPTICS_FEEDBACK),
                  on: { click: onCancel },
                }),
            ])
          : null

      const renderCancel = () => {
        const content = slots.cancel?.() ?? props.cancelText
        if (content) {
          return [
            h('div', { class: bem('gap') }),
            h('button', { class: bem('cancel'), attrs: { type: 'button' }, on: { click: onCancel } }, [content]),
          ]
        }
      }
      const renderActionContent = (item, index) => {
        if (item.loading) {
          return <ProgressCircular class={bem('loading')} indeterminate={true} width={1.2} />
        }
        if (slots.item) {
          return slots.item({ item, index })
        }
        return [
          <span class={bem('name')}>{item.name}</span>,
          item.subname && <div class={bem('subname')}>{item.subname}</div>,
        ]
      }

      const renderAction = (item, index) =>
        h(
          'button',
          {
            class: [bem('item', { loading: item.loading, disabled: item.disabled }), item.className],
            style: { color: item.color },
            on: { click: () => onSelect(item, index) },
          },
          [renderActionContent(item, index)],
        )

      const renderDesc = () => {
        const content = slots.desc ? slots.desc() : props.desc
        if (content) {
          return h('div', { class: bem('desc') }, [content])
        }
      }

      const attrs = assign(
        {
          contentClass: bem(),
          wrapperClass: bem('popup'),
          position: 'bottom',
        },
        pick(props, popupInheritPropKeys),
      )
      const data = {
        attrs,
        on: getListeners(popupListenerKeys),
      }
      console.log(getCurrentInstance(), '----');
      return h(Popup, data, [
        renderHeader(),
        renderDesc(),
        h('div', { class: bem('content') }, [props.items.map(renderAction), slots.default?.()]),
        renderCancel(),
      ])
    }
  }
})
