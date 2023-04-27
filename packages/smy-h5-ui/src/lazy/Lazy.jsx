import { props } from './props'
import Intersect from '../intersect'
import { getSlot } from '../_utils/vue/slots'

import '../_styles/transition.less'

const MaybeTransition = {
  name: 'MaybeTransition',
  functional: true,
  render: (h, { data, children }) => (data.attrs?.name ? h('transition', data, children) : children),
}

export default {
  name: 'SmyLazy',
  directives: { Intersect },
  props,
  data: (vm) => ({
    isActive: vm.value,
  }),
  watch: {
    value(newValue) {
      this.$nextTick(() => {
        if (this.isActive === newValue) return
        this.isActive = newValue
      })
    },
  },
  methods: {
    onIntersect(isIntersecting) {
      if (this.isActive) return
      this.isActive = isIntersecting
      this.$emit('input', isIntersecting)
    },
  },
  render(h) {
    const { tag, isActive, onIntersect, options, transition } = this
    const intersectDirective = {
      name: 'intersect',
      value: {
        handler: onIntersect,
        options,
      },
      modifiers: { once: isActive },
    }
    const data = {
      staticClass: 'smy-lazy',
      directives: [intersectDirective],
    }
    const child = isActive ? (
      <MaybeTransition appear name={transition}>
        {getSlot(this, 'default', { value: isActive })}
      </MaybeTransition>
    ) : null
    return h(tag, data, child && [child])
  },
}
