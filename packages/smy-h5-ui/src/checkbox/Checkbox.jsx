import { assign } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import Checker from './Checker'
import { props } from './props'
import { createChildrenMixin } from '../_mixins/relation'

import '../_styles/common.less'
import './checkbox.less'

const [name, bem] = createNamespace('checkbox')

export default {
  name,
  mixins: [createChildrenMixin('checkboxGroup')],
  props,
  model: {
    prop: 'checked',
    event: 'input',
  },
  computed: {
    _checked({ checked, checkboxGroup, bindGroup, value }) {
      if (checkboxGroup && bindGroup) {
        return checkboxGroup.value.indexOf(value) !== -1
      }
      return !!checked
    },
  },
  watch: {
    value(newValue) {
      if (this.indeterminate === null) {
        this.$emit('change', newValue)
      }
    },
  },
  methods: {
    toggle(newValue = !this._checked) {
      const { checkboxGroup: parent, bindGroup, value } = this
      if (parent && bindGroup) {
        const { max, value: parentValue } = parent.$props
        const values = parentValue.slice()
        if (newValue) {
          const overlimit = max && values.length >= +max
          if (!overlimit && !values.includes(value)) {
            values.push(value)
            parent.updateValue(values)
          }
        } else {
          const index = values.indexOf(value)
          if (index !== -1) {
            values.splice(index, 1)

            parent.updateValue(values)
          }
        }
      } else {
        this.$emit('input', newValue)
      }
      if (this.indeterminate !== null) {
        this.$emit('change', newValue)
      }
    },
  },
  render(h) {
    const vm = this
    const scopedSlots = assign({}, vm.$scopedSlots)

    const { _checked: checked, checkboxGroup: parent } = vm
    const attrs = assign({}, vm.$props, {
      role: 'checkbox',
      bem,
      checked,
      parent,
    })
    return h(Checker, {
      attrs,
      on: { toggle: vm.toggle },
      scopedSlots,
    })
  },
}
