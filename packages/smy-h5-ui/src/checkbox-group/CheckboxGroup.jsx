import { createParentMixin } from '../_mixins/relation'
import { isPlainObject } from '../_utils/is'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('checkbox-group')

export default {
  name,
  mixins: [createParentMixin('checkboxGroup')],
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
    toggleAll(options) {
      let checked = false
      if (isPlainObject(options)) {
        ;({ checked } = options)
      } else {
        checked = options
      }
      const values = []
      this.children.forEach((item) => {
        const { $props } = item
        if (!$props.bindGroup) {
          return
        }
        if (checked ?? !item._checked) {
          values.push($props.value)
        }
      })
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
