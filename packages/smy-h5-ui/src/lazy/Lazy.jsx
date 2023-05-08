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
  mixins: [createProxiedModel('value', 'isIntersecting')],
  props,
  methods: {
    onIntersect(val) {
      if (this.isIntersecting) return
      this.isIntersecting = val
    },
  },
  render(h) {
    const { tag, isIntersecting, onIntersect, options, transition, keepShow } = this
    const intersectDirective = {
      name: 'intersect',
      value: {
        handler: onIntersect,
        options,
      },
      modifiers: { once: isIntersecting },
    }
    const data = {
      staticClass: 'smy-lazy',
      directives: [intersectDirective],
    }
    const defaultSlot = getSlot(this, 'default', { value: isIntersecting })
    const child =
      isIntersecting || keepShow ? (
        <MaybeTransition name={keepShow ? undefined : transition} appear>
          {defaultSlot}
        </MaybeTransition>
      ) : null
    return h(tag, data, child && [child])
  },
}
