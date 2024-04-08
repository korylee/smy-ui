import { createChildrenMixin } from '../_mixins/relation'
import { createNamespace } from '../_utils/vue/create'

import './swiperItem.less'

const [name, bem] = createNamespace('swiper-item')

export default {
  name,
  mixins: [createChildrenMixin('swiper')],
  data: () => ({ offset: 0 }),
  computed: {
    style({ swiper, offset }) {
      const style = {}
      const isVertical = swiper?.vertical
      const size = swiper?.size
      if (size) {
        style[isVertical ? 'height' : 'width'] = `${size}px`
      }
      if (offset) {
        style.transform = `translate${isVertical ? 'Y' : 'X'}(${offset}px)`
      }
      return style
    },
  },
  methods: {
    setOffset(offset) {
      this.offset = offset
    },
  },
  render() {
    const vm = this
    const _c = vm.$createElement

    const { style } = vm
    return _c(
      'div',
      {
        on: vm.$listeners,
        class: bem(),
        style,
      },
      vm._t('default'),
    )
  },
}
