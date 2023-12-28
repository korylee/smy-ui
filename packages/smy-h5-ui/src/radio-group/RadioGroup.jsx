import { createParentMixin } from '../_mixins/relation'
import { createNamespace } from '../_utils/vue/create'
import { RADIO_KEY } from './common'
import { props } from './props'

import './radioGroup.less'

const [name, bem] = createNamespace('radio-group')

export default {
  name,
  mixins: [createParentMixin(RADIO_KEY)],
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
  },
  render() {
    const _vm = this
    const _h = _vm.$createElement
    const _c = _vm._self._c || _h
    const { direction } = _vm
    return _c(
      'div',
      {
        class: bem([direction]),
        attrs: { role: 'radiogroup' },
      },
      [_vm._t('default')],
      2,
    )
  },
}
