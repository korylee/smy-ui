import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

import './cell.less'

const [name, bem] = createNamespace('cell')

export default {
  name,
  props,
  render() {
    const _vm = this
    const _h = _vm.$createElement
    const _c = _vm._self._c || _h
    const renderIcon = () => {
      const iconVNode = _vm._t('icon')
      return iconVNode ? _c('div', { class: bem('icon') }, [iconVNode], 2) : null
    }
    const renderTitle = () => {
      const { desc } = _vm
      const descVNode = _vm._t('desc') || _vm._s(desc)
      return (
        <div class={[bem('title'), _vm.titleClass]}>
          {_vm._t('title', () => [_vm._t('default', () => [_vm._s(_vm.title)])])}
          {descVNode ? _c('div', { class: [bem('desc'), _vm.descClass] }, [descVNode], 2) : null}
        </div>
      )
    }
    const renderValue = () => {
      const { value } = _vm
      const valueVNode = _vm._t('value') || _vm._s(value)
      return valueVNode ? <div class={bem('value')}>{valueVNode}</div> : null
    }
    const renderExtra = () => {
      const extraVNode = _vm._t('extra')
      return extraVNode ? <div class={[bem('extra'), _vm.extraClass]}>{extraVNode}</div> : null
    }

    const data = {
      class: bem({
        borderless: !_vm.border,
        insert: _vm.insert,
        clickable: _vm.clickable,
      }),
      on: _vm.$listeners,
    }
    return _h('div', data, [renderIcon(), renderTitle(), renderValue(), renderExtra()])
  },
}
