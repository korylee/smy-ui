import { assign } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import Checker from './Checker'
import { props } from './props'

import '../_styles/common.less'
import './checkbox.less'

const [name, bem] = createNamespace('checkbox')

export default {
  name,
  props,
  model: {
    prop: 'checked',
    event: 'input',
  },
  computed: {
    _checked() {
      return !!this.checked
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
      this.$emit('input', newValue)
      if (this.indeterminate !== null) {
        this.$emit('change', newValue)
      }
    },
  },
  render(h) {
    const vm = this
    const scopedSlots = assign({}, vm.$scopedSlots)

    const { _checked: checked } = vm
    const attrs = assign(
      {
        role: 'checkbox',
        bem,
        checked,
      },
      this.$props,
    )
    return h(Checker, {
      attrs,
      on: { toggle: vm.toggle },
      scopedSlots,
    })
  },
}
