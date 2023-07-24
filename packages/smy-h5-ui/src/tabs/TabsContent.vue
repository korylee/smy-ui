<template>
  <div :class="bem('content', { animated: animated || swipeable })">
    <maybe-swiper
      ref="swiper"
      :maybe="animated || swipeable"
      :loop="false"
      :class="bem('track')"
      :indicators="false"
      @change="$emit('change', $event)"
    >
      <slot
    /></maybe-swiper>
  </div>
</template>

<script>
import { createMaybeComponent } from '../_utils/vue/component'
import { createNamespace } from '../_utils/vue/create'
import { numericProp } from '../_utils/vue/props'
import SmySwiper from '../swiper'

const MaybeSwiper = createMaybeComponent('MaybeSwiper', SmySwiper)

const [name, bem] = createNamespace('tabs')

export default {
  name: name + '-content',
  props: {
    count: Number,
    inited: Boolean,
    swipeable: Boolean,
    animated: Boolean,
    duration: numericProp,
    currentIndex: Number,
  },
  components: { MaybeSwiper },
  watch: {
    currentIndex: 'swipeToCurrentTab',
  },
  mounted() {
    this.$nextTick(() => {
      this.swipeToCurrentTab()
    })
  },
  methods: {
    bem,
    swipeToCurrentTab(index) {
      const { swiper } = this.$refs
      if (!swiper) return
      const { to, active } = swiper
      if (active !== index && to) {
        to(index)
      }
      console.log(active)
    },
  },
}
</script>
