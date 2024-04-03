import { createChildrenMixin } from '../_mixins/relation'
import { assign } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import Checker from '../checkbox/Checker'
import { props } from './props'
import { RADIO_KEY } from '../radio-group/shared'

import '../_styles/common.less'
import './radio.less'

const [name, bem] = createNamespace('radio')

export default {
  name,
  mixins: [createChildrenMixin(RADIO_KEY)],
  props,
  model: {
    prop: 'checked',
    event: 'input',
  },
  computed: {
    _checked({ [RADIO_KEY]: radioGroup, value, checked, bindGroup }) {
      if (bindGroup && radioGroup) {
        return radioGroup.value === value
      }
      return checked === value
    },
  },
  methods: {
    toggle() {
      const { [RADIO_KEY]: radioGroup, value, bindGroup, _checked } = this
      if (bindGroup && radioGroup) {
        radioGroup.updateValue(value)
      } else {
        this.$emit('input', !_checked)
      }
    },
  },
  render() {
    const _vm = this
    const _h = _vm.$createElement
    const _c = _vm._self._c || _h
    const { [RADIO_KEY]: radioGroup, _checked: checked } = _vm

    const attrs = assign({}, _vm.$props, {
      role: 'radio',
      bem,
      parent: radioGroup,
      checked,
    })

    return _c(Checker, {
      attrs,
      on: { toggle: _vm.toggle },
      scopedSlots: _vm.$scopedSlots,
    })
  },
}
