import { assign } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import Checker from './Checker'
import { props } from './props'
import { createChildrenMixin } from '../_mixins/relation'
import { CHECKBOX_KEY } from '../checkbox-group/shared'
import { defineComponent } from 'vue'

import '../_styles/common.less'
import './checkbox.less'


const [name, bem] = createNamespace('checkbox')

export default defineComponent({
  name,
  mixins: [createChildrenMixin(CHECKBOX_KEY)],
  props,
  model: {
    prop: 'checked',
    event: 'input',
  },
  computed: {
    _checked({ checked, [CHECKBOX_KEY]: parent, bindGroup, value }) {
      if (parent && bindGroup) {
        return parent.value.indexOf(value) !== -1
      }
      return !!checked
    },
  },
  watch: {
    checked(newValue) {
      if (this.indeterminate === null) {
        this.$emit('change', newValue)
      }
    },
  },
  methods: {
    toggle(newValue = !this._checked) {
      const { [CHECKBOX_KEY]: parent, bindGroup, value } = this
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
    const _vm = this
    const { _checked: checked, [CHECKBOX_KEY]: parent } = _vm

    const data = _vm._g(
      _vm._b(
        {
          attrs: assign({}, _vm.$props, {
            role: 'checkbox',
            bem,
            parent,
            checked,
          }),
          on: { toggle: _vm.toggle },
          scopedSlots: _vm.$scopedSlots,
        },
        'checker',
        _vm.$attrs,
        false,
      ),
      _vm.$listeners,
    )
    return h(Checker, data)
  },
})
