<template>
  <div :class="bem('column')" @touchstart="onTouchstart" @touchmove.prevent="onTouchmove" @touchend="onTouchend">
    <div :style="scrollerStyle" :class="bem('scroller')" ref="scrollEl" @transitionend="onTransitionend">
      <div
        v-for="(item, itemIndex) in scrollColumn.column"
        :key="itemIndex"
        :style="{ height: `${height}px` }"
        :class="bem('item', { disabled: getDisabled(item) })"
      >
        <slot name="item" :item="item" :index="itemIndex" />
      </div>
    </div>
  </div>
</template>

<script>
import { getTranslate } from '../_utils/dom'
import { range } from '../_utils/shared'
import { bem, name, findIndexFromColumn } from './utils'

const MOMENTUM_RECORD_TIME = 300
const MOMENTUM_ALLOW_DISTANCE = 15
const MOMENTUM_DISTANCE_MULTIPLES = 0.003

function momentum(distance, duration) {
  return distance / duration / MOMENTUM_DISTANCE_MULTIPLES
}

export default {
  name: name + '-column',
  props: {
    height: Number,
    center: Number,
    getDisabled: Function,
    scrollColumn: Object,
  },
  data: (vm) => ({
    duration: 0,
    prevY: undefined,
    momentumPrevY: undefined,
    momentumTime: 0,
    touching: false,
    translate: vm.center,
    scrolling: false,
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
    'scrollColumn.pickedIndex': {
      immediate: true,
      handler(val) {
        console.log('-----', this._isMounted, this.scrollColumn, val, this.pickedIndex)
        if (val === this.pickedIndex) return
        this.scrollTo(val, 0)
      },
    },
  },

  methods: {
    bem,
    onTouchstart() {
      const { scrollEl } = this.$refs
      this.touching = true
      this.scrolling = false
      this.duration = 0
      this.translate = getTranslate(scrollEl)
    },
    onTouchmove(event) {
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
    onTouchend() {
      this.touching = false
      this.scrolling = true
      this.prevY = undefined
      const distance = this.translate - this.momentumPrevY
      const duration = performance.now() - this.momentumTime
      const shouldMomentum = Math.abs(distance) >= MOMENTUM_ALLOW_DISTANCE && duration <= MOMENTUM_RECORD_TIME
      shouldMomentum && (this.translate += momentum(distance, duration))
      const index = this.getIndex(this.translate)
      this.scrollTo(index, shouldMomentum ? 800 : 200)
    },

    onTransitionend() {
      this.change()
    },

    limitTranslate(translate) {
      const {
        height,
        center,
        scrollColumn: { column },
      } = this
      const START_LIMIT = height + center
      const END_LIMIT = center - column.length * height

      return range(translate, END_LIMIT, START_LIMIT)
    },

    scrollTo(index, duration = 0, noEmit = false) {
      const { height, center, scrollColumn } = this
      const translate = center - index * height
      this.prevIndex = scrollColumn.pickedIndex

      if (translate === this.translate) {
        this.scrolling = false
        this.change(noEmit)
      } else {
        this.translate = translate
      }
      this.duration = duration
      if (scrollColumn.pickedIndex === index) return
      this.pickedIndex = index
      scrollColumn.pickedIndex = index
      this.$emit('scroll-into')
    },
    change(onEmit = false) {
      const { scrollColumn, prevIndex } = this
      this.scrolling = false
      const moved = prevIndex !== scrollColumn.pickedIndex
      !onEmit && moved && this.$emit('change')
    },
    stopScroll() {
      const { scrollEl } = this.$refs
      const index = this.getIndex(getTranslate(scrollEl))
      this.scrollTo(index, 0, true)
    },
    getIndex(translate) {
      const { center, height, scrollColumn, getDisabled } = this
      const index = Math.round((center - translate) / height)
      return findIndexFromColumn(index, scrollColumn, getDisabled)
    },
  },
}
</script>
