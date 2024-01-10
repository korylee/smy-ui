<template>
  <div v-on="$listeners" :class="bem()" :style="style">
    <slot />
  </div>
</template>

<script>
import { createChildrenMixin } from '../_mixins/relation'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('swiper-item')

export default {
  name,
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
    bem,
    setOffset(offset) {
      this.offset = offset
    },
  },
}
</script>

<style lang="less">
@import './swiperItem.less';
</style>
