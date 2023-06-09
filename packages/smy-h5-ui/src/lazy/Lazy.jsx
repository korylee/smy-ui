import { props } from './props'
import Intersect from '../intersect'
import { getSlot } from '../_utils/vue/slots'

import '../_styles/transition.less'
import { createProxiedModel } from '../_mixins/proxiedModel'
import { MaybeTransition } from '../_utils/vue/component'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('lazy')

export default {
  name,
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
      staticClass: bem(),
      directives: [intersectDirective],
    }
    const defaultSlot = getSlot(this, 'default', { value: isIntersecting })
    const child =
      isIntersecting || keepShow ? (
        <MaybeTransition maybe={!!transition} name={transition} appear>
          {defaultSlot}
        </MaybeTransition>
      ) : null
    return h(tag, data, child && [child])
  },
}
