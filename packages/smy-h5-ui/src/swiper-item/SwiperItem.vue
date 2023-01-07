<template>
  <div v-on="$listeners" class="smy-swiper-item" :style="style">
    <slot />
  </div>
</template>

<script>
import { createChildrenMixin } from '../_utils/mixins/relation'

export default {
  name: 'SmySwiperItem',
  mixins: [createChildrenMixin('swiper')],
  data: () => ({
    offset: 0,
  }),
  computed: {
    style() {
      const style = {}
      const isVertical = this.swiper?.vertical
      const size = this.swiper?.size
      if (size) {
        style[isVertical ? 'height' : 'width'] = `${size}px`
      }
      if (this.offset) {
        style.transform = `translate${isVertical ? 'Y' : 'X'}(${this.offset}px)`
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
