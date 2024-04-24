import { convertToUnit, pick, isFunction, isString } from '@smy-h5/shared'
import { assign } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import Popup from '../popup'
import { popupInheritPropKeys, props } from './props'
import { popupListenerKeys } from '../popup/shared'
import { BORDER_LEFT, BORDER_TOP } from '../_utils/contant'
import { defineComponent, h } from 'vue'
import { getListeners } from '../_utils/vue/listener'

import '../_styles/common.less'
import './dialog.less'

const [name, bem] = createNamespace('dialog')

export default defineComponent({
  name,
  props,
  setup(props, { emit, slots }) {
    function getHandler(action) {
      return () => {
        if (!props.show) {
          return
        }
        props.callback?.(action)
        emit(action)
        emit('update:show', false)
      }
    }
    return () => {
      const headerContent = slots.title ? slots.title() : props.title
      const hasHeader = !!headerContent
      const defaultVnode = slots.default?.()

      const renderHeader = () => {
        if (headerContent) {
          return h('div', { class: bem('header', { isolated: !props.content && !defaultVnode }) }, [headerContent])
        }
      }

      const renderBody = () => {
        if (defaultVnode) {
          return h('div', { class: bem('body') }, defaultVnode)
        }
        const { content: _content } = props
        if (_content) {
          const content = isFunction(_content) ? _content() : _content
          const domPropName = props.allowHtml && isString(content) ? 'innerHTML' : 'textContent'
          const Content = h('div', {
            class: bem('content', { 'has-header': hasHeader }),
            domProps: { [domPropName]: content },
          })
          return <div class={bem('body', { isolated: !hasHeader })}>{Content}</div>
        }
      }

      const renderFooter = () =>
        slots.footer
          ? slots.footer()
          : h('div', { class: bem('footer', BORDER_TOP) }, [
              props.showCancel &&
                h(
                  'button',
                  {
                    class: bem('cancel'),
                    style: { color: props.cancelColor },
                    on: { click: getHandler('cancel') },
                  },
                  [props.cancelText],
                ),
              props.showConfirm &&
                h(
                  'button',
                  {
                    class: [bem('confirm', { [BORDER_LEFT]: props.showCancel })],
                    style: { color: props.confirmColor },
                    on: { click: getHandler('confirm') },
                  },
                  [props.confirmText],
                ),
            ])

      const attrs = assign(pick(props, popupInheritPropKeys), {
        contentClass: bem(),
        wrapperClass: bem('popup'),
        tabindex: 0,
        'aria-labelledy': props.title || props.content,
      })
      return h(
        Popup,
        {
          ref: 'popup',
          attrs,
          style: { width: convertToUnit(props.width) },
          on: getListeners(popupListenerKeys),
        },
        [renderHeader(), renderBody(), renderFooter()],
      )
    }
  },
})
