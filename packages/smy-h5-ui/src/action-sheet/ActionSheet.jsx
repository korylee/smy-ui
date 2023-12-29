import { getListeners } from '../_mixins/listeners'
import { createNamespace } from '../_utils/vue/create'
import Popup from '../popup'
import ProgressCircular from '../progress-circular'
import Icon from '../icon'
import { popupInheritPropKeys, props } from './props'
import { popupListenerKeys } from '../popup/shared'
import { assign, pick } from '../_utils/shared'

import '../_styles/common.less'
import './actionSheet.less'

const [name, bem] = createNamespace('action-sheet')

export default {
  name,
  props,
  methods: {
    onSelect(item, index) {
      const { disabled, loading, callback } = item
      if (disabled || loading) {
        return
      }
      callback?.(item)

      this.$nextTick(() => this.$emit('select', item, index))
    },
    onCancel() {
      this.$emit('update:show', false)
      this.$emit('cancel')
    },
  },
  render() {
    /**@type {import('vue').default} */
    const vm = this
    const c = vm.$createElement

    const renderHeader = () =>
      vm.title
        ? c('div', { class: bem('header') }, [
            vm.title,
            vm.closeIcon &&
              c(Icon, { attrs: { name: vm.closeIcon }, class: [bem('close')], on: { click: vm.onCancel } }),
          ])
        : null

    const renderCancel = () => {
      const content = vm._t('cancel') || vm.cancelText
      if (content) {
        return [
          c('div', { class: bem('gap') }),
          c('button', { class: bem('cancel'), attrs: { type: 'button' }, on: { click: vm.onCancel } }, [content]),
        ]
      }
    }
    const renderActionContent = (item, index) => {
      if (item.loading) {
        return c(ProgressCircular, {
          class: bem('loading'),
          attrs: { indeterminate: true, width: 1.2 },
        })
      }
      return vm._t(
        'item',
        () => [
          c('span', { class: bem('name') }, [item.name]),
          item.subname && c('div', { class: bem('subname') }, [item.subname]),
        ],
        { item, index },
      )
    }

    const renderAction = (item, index) =>
      c(
        'button',
        {
          class: [bem('item', { loading: item.loading, disabled: item.disabled }), item.className],
          style: { color: item.color },
          on: { click: () => vm.onSelect(item, index) },
        },
        [renderActionContent(item, index)],
      )

    const renderDesc = () => {
      const content = vm._t('desc') || vm.desc
      if (content) {
        return c('div', { class: bem('desc') }, [content])
      }
    }

    const attrs = assign(
      {
        contentClass: bem(),
        wrapperClass: bem('popup'),
        position: 'bottom',
      },
      pick(vm, popupInheritPropKeys),
    )
    const data = {
      attrs,
      on: getListeners.call(vm, popupListenerKeys),
    }
    return c(Popup, data, [
      renderHeader(),
      renderDesc(),
      c('div', { class: bem('content') }, [vm.items.map(renderAction), vm._t('default')]),
      renderCancel(),
    ])
  },
}
