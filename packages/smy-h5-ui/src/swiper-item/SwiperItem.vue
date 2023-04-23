<template>
  <div v-on="$listeners" class="smy-swiper-item" :style="style">
    <slot />
  </div>
</template>

<script>
import { createChildrenMixin } from '../_mixins/relation'

export default {
  name: 'SmySwiperItem',
  mixins: [createChildrenMixin('swiper')],
  data: () => ({
    offset: 0,
  }),
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
}
</script>
