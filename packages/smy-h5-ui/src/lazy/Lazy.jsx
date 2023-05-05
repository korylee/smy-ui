import { props } from './props'
import Intersect from '../intersect'
import { getSlot } from '../_utils/vue/slots'

import '../_styles/transition.less'
import { createProxiedModel } from '../_mixins/proxiedModel'

const MaybeTransition = {
  name: 'MaybeTransition',
  functional: true,
  render: (h, { data, children }) => (data.attrs?.name ? h('transition', data, children) : children),
}

export default {
  name: 'SmyLazy',
  directives: { Intersect },
  mixins: [createProxiedModel('value', 'isActive')],
  props,
  methods: {
    onIntersect(isIntersecting) {
      if (this.isActive) return
      this.isActive = isIntersecting
    },
  },
  render(h) {
    const { tag, isActive, onIntersect, options, transition, keepShow } = this
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
    const defaultSlot = getSlot(this, 'default', { value: isActive })
    if (keepShow) {
      return defaultSlot
    }
    const child = isActive ? (
      <MaybeTransition name={transition} appear>
        {defaultSlot}
      </MaybeTransition>
    ) : null
    return h(tag, data, child && [child])
  },
}
