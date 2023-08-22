<template>
  <div
    :class="bem('column')"
    @touchstart="handleTouchstart"
    @touchmove.prevent="handleTouchmove"
    @touchend="handleTouchend"
  >
    <div :style="scrollerStyle" :class="bem('scroller')" ref="scrollEl" @transitionend="handleTransitionend">
      <div
        v-for="(item, itemIndex) in column"
        :key="itemIndex"
        :style="{ height: `${height}px` }"
        :class="bem('option')"
      >
        <slot name="item" :item="item" :index="itemIndex" />
      </div>
    </div>
  </div>
</template>

<script>
import { getTranslate } from '../_utils/dom'
import { range } from '../_utils/shared'
import { bem, name } from './utils'

const MOMENTUM_RECORD_TIME = 300
const MOMENTUM_ALLOW_DISTANCE = 15

function momentum(distance, duration) {
  return distance / duration / 0.003
}

export default {
  name: name + '-column',
  props: {
    height: Number,
    column: Array,
    columnIndex: Number,
    pickedIndex: Number,
    center: Number,
  },
  data: (vm) => ({
    duration: 0,
    prevY: undefined,
    momentumPrevY: undefined,
    momentumTime: 0,
    touching: false,
    translate: vm.center,
    scrolling: false,
    index: 0,
  }),

  computed: {
    scrollerStyle({ translate, duration }) {
      return {
        transform: `translate3d(0, ${translate}px, 0)`,
        transitionDuration: `${duration}ms`,
        transitionProperty: duration ? 'transform' : 'none',
      }
    },
  },

  watch: {
    pickedIndex: {
      immediate: true,
      handler(pickedIndex) {
        if (pickedIndex === this.index) return
        this.scrollTo(pickedIndex, 0)
      },
    },
  },

  methods: {
    bem,
    handleTouchstart() {
      const { scrollEl } = this.$refs
      this.touching = true
      this.scrolling = false
      this.duration = 0
      this.translate = getTranslate(scrollEl)
    },
    handleTouchmove(event) {
      if (!this.touching) return

      const { clientY } = event.touches[0]
      const moveY = this.prevY !== undefined ? clientY - this.prevY : 0
      this.prevY = clientY

      this.translate = this.limitTranslate(this.translate + moveY)

      const now = performance.now()
      if (now - this.momentumTime > MOMENTUM_RECORD_TIME) {
        this.momentumTime = now
        this.momentumPrevY = this.translate
      }
    },
    handleTouchend() {
      this.touching = false
      this.scrolling = true
      this.prevY = undefined
      const distance = this.translate - this.momentumPrevY
      const duration = performance.now() - this.momentumTime
      const shouldMomentum = Math.abs(distance) >= MOMENTUM_ALLOW_DISTANCE && duration <= MOMENTUM_RECORD_TIME
      shouldMomentum && (this.translate += momentum(distance, duration))
      this.scrollTo(this.getIndex(this.translate), shouldMomentum ? 1000 : 200)
    },

    handleTransitionend() {
      this.scrolling = false
      this.change()
    },

    limitTranslate(translate) {
      const { height, center, column } = this
      const START_LIMIT = height + center
      const END_LIMIT = center - column.length * height

      return range(translate, END_LIMIT, START_LIMIT)
    },

    scrollTo(index, duration = 0, noEmit = false) {
      const { height, center } = this
      const translate = center - index * height
      if (translate === this.translate) {
        this.scrolling = false
        !noEmit && this.change()
      } else {
        this.translate = translate
      }
      this.duration = duration
      if (this.index === index) return
      this.index = index
      this.$emit('update:picked-index', index)
    },
    change() {
      this.$emit('change')
    },
    stopScroll() {
      const { scrollEl } = this.$refs
      const index = this.getIndex(getTranslate(scrollEl))
      this.scrollTo(index, 0, true)
    },
    getIndex(translate) {
      const { center, height, column } = this
      return range(Math.round((center - translate) / height), 0, column.length - 1)
    },
  },
}
</script>
