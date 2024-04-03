import { convertToUnit, pick, isFunction, isString } from '@smy-h5/shared'
import { assign } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import Popup from '../popup'
import { popupInheritPropKeys, props } from './props'
import { getListeners } from '../_mixins/listeners'
import { popupListenerKeys } from '../popup/shared'
import { BORDER_LEFT, BORDER_TOP } from '../_utils/contant'

import '../_styles/common.less'
import './dialog.less'

const [name, bem] = createNamespace('dialog')

export default {
  name,
  props,
  methods: {
    getHandler(action) {
      if (!this.show) {
        return
      }
      this.callback?.(action)
      this.$emit(action)
      this.$emit('update:show', false)
    },
  },
  render() {
    /** @type {import('vue').default} */
    const vm = this
    const c = vm.$createElement
    const headerContent = vm._t('title') || vm.title
    const hasHeader = !!headerContent
    const defaultVnode = vm._t('default')

    const renderHeader = () => {
      if (headerContent) {
        return c('div', { class: bem('header', { isolated: !vm.content && !defaultVnode }) }, [headerContent])
      }
    }

    const renderContent = () => {
      const { content: _content, allowHtml } = vm
      const className = bem('content', {
        'has-header': hasHeader,
      })
      const content = isFunction(_content) ? _content() : _content
      if (allowHtml && isString(content)) {
        return c('div', { class: className, domProps: { innerHTML: content } })
      }
      return c('div', { class: className }, [content])
    }

    const renderBody = () => {
      if (defaultVnode) {
        return c('div', { class: bem('body') }, defaultVnode)
      }

      if (vm.content) {
        return c('div', { class: bem('body', { isolated: !hasHeader }) }, [renderContent()])
      }
    }

    const renderFooter = () =>
      vm._t('footer', () =>
        c('div', { class: bem('footer', BORDER_TOP) }, [
          vm.showCancel &&
            c(
              'button',
              {
                class: bem('cancel'),
                style: { color: vm.cancelColor },
                on: { click: () => vm.getHandler('cancel') },
              },
              [vm.cancelText],
            ),
          vm.showConfirm &&
            c(
              'button',
              {
                class: [bem('confirm', { [BORDER_LEFT]: vm.showCancel })],
                style: { color: vm.confirmColor },
                on: { click: () => vm.getHandler('confirm') },
              },
              [vm.confirmText],
            ),
        ]),
      )

    const attrs = assign(pick(vm.$props, popupInheritPropKeys), {
      contentClass: bem(),
      wrapperClass: bem('popup'),
      tabindex: 0,
      'aria-labelledy': vm.title || vm.content,
    })
    return c(
      Popup,
      {
        ref: 'popup',
        attrs,
        style: { width: convertToUnit(vm.width) },
        on: getListeners.call(vm, popupListenerKeys),
      },
      [renderHeader(), renderBody(), renderFooter()],
    )
  },
}
