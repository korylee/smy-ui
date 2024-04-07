import { createParentMixin } from '../_mixins/relation'
import { isBool } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import { CHECKBOX_KEY } from './shared'

import './checkboxGroup.less'

const [name, bem] = createNamespace('checkbox-group')

export default {
  name,
  mixins: [createParentMixin(CHECKBOX_KEY)],
  props,
  watch: {
    value(val) {
      this.$emit('change', val)
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
    toggleAll(options = {}) {
      if (isBool(options)) {
        options = { checked: options }
      }
      const { checked, skipDisabled } = options
      const checkedChildren = this.children.filter((item) => {
        const { $props: itemProps, _checked: itemChecked } = item
        if (!itemProps.bindGroup) {
          return false
        }
        if (itemProps.disabled && skipDisabled) {
          return itemChecked
        }
        return checked ?? !itemChecked
      })
      const values = checkedChildren.map((item) => item.value)
      this.updateValue(values)
    },
  },
  render() {
    const _vm = this
    const _h = _vm.$createElement
    const _c = _vm._self._c || _h
    return _c(
      'div',
      {
        class: bem(),
      },
      [_vm._t('default')],
      2,
    )
  },
}
