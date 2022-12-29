<template>
  <div
    ref="container"
    class="smy-swiper"
    :class="{ 'smy-swiper--vertical': isVertical }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div class="smy-swiper__inner" :style="style"><slot /></div>
    <slot v-if="pagination" name="page">
      <div class="smy-swiper__pagination">
        <i
          v-for="(item, index) of children"
          :key="index"
          class="smy-swiper__pagination-item"
          :class="{ 'smy-swiper__pagination-item--active': activePagination === index }"
        />
      </div>
    </slot>
  </div>
</template>

<script>
import { createParentMixin } from '../_utils/mixins/relation'
import { useTouch } from '../_utils/vue/useTouch'
import { props } from './props'

const requestFrame = (fn) => {
  window.requestAnimationFrame.call(window, fn)
}

const range = (num, min, max) => Math.min(Math.max(num, min), max)

export default {
  name: 'SmySwiper',
  mixins: [createParentMixin('swiper')],
  props,
  data: () => ({
    touch: useTouch(),
    active: 0,
    num: 0,
    rect: null,
    internalWidth: 0,
    internalHeight: 0,
    moving: 0,
    offset: 0,
    touchTime: 0,
    autoPlayTimer: 0,
    style: {},
  }),
  computed: {
    isVertical() {
      return this.direction === 'vertical'
    },
    isCorrectDirection() {
      return this.touch?.state.direction === this.direction
    },
    size() {
      if (this.isVertical) return this.height
      return this.width
    },
    childrenCount() {
      return this.children.length
    },
    trackSize() {
      return this.childrenCount * this.size
    },
    minOffset() {
      if (this.rect) {
        const base = this.rect[this.isVertical ? 'height' : 'width']
        return base - this.size * this.childrenCount
      }
      return 0
    },
    activePagination({ childrenCount }) {
      return (this.active + childrenCount) % childrenCount
    },
    delta() {
      if (!this.touch) return 0
      return this.touch.state[this.isVertical ? 'deltaY' : 'deltaX']
    },
  },
  watch: {
    initPage(val) {
      this.$nextTick(() => {
        this.init(Number(val))
      })
    },
    childrenCount() {
      this.$nextTick(() => {
        this.init()
      })
    },
    autoPlay(val) {
      val > 0 ? this.startAutoPlay() : this.stopAutoPlay()
    },
  },
  created() {
    this.$once('hook:beforeDestroy', this.stopAutoPlay)
    this.$once('hook:deactivated', this.stopAutoPlay)
  },
  methods: {
    onTouchStart(e) {
      if (this.isPreventDefault) e.preventDefault()
      if (this.isStopPropagation) e.stopPropagation()
      if (!this.touchable) return
      this.touch.start(e)
      this.touchTime = Date.now()
      this.stopAutoPlay()
      this.resetPosition()
    },
    onTouchMove(e) {
      if (!this.touchable || !this.moving) return
      this.touch.move(e)
      if (this.isCorrectDirection) {
        this.move({ offset: this.delta })
      }
    },
    onTouchEnd(e) {
      if (!this.touchable || !this.moving) return
      const { delta, size } = this
      const speed = delta / (Date.now() - this.touchTime)
      const isShouldMove = Math.abs(speed) > 0.3 || Math.abs(delta) > +(size / 2).toFixed(2)
      if (isShouldMove && this.isCorrectDirection) {
        let pace = 0
        const offset = this.touch.state[this.isVertical ? 'offsetY' : 'offsetX']
        if (this.loop) {
          pace = offset > 0 ? (delta > 0 ? -1 : 1) : 0
        } else {
          pace = -Math[delta > 0 ? 'ceil' : 'floor'](delta / size)
        }
        this.move({ pace, isEmit: true })
      } else if (delta) {
        this.move({ pace: 0 })
      }
      this.moving = false
      this.getStyle()
      this.startAutoPlay()
    },
    getActive(pace) {
      const { active } = this
      if (pace) {
        if (this.loop) {
          return range(active + pace, -1, this.childrenCount)
        }
        return range(active + pace, 0, this.childrenCount - 1)
      }
      return active
    },
    getOffset(active, offset = 0) {
      let currentPosition = active * this.size
      if (!this.loop) {
        currentPosition = Math.min(currentPosition, -this.minOffset)
      }
      const targetOffset = offset - currentPosition
      if (!this.loop) {
        return range(targetOffset, this.minOffset, 0)
      }
      return targetOffset
    },
    getStyle() {
      let offset = 0
      const { isVertical } = this
      if (!this.center) {
        offset = this.offset
      } else {
        const val = isVertical ? this.rect.height - this.size : this.rect.width - this.size
        offset = this.offset + (this.active === this.childrenCount - 1 ? -val / 2 : val / 2)
      }
      this.style = {
        transitionDuration: `${this.moving ? 0 : this.duration}ms`,
        transform: `translate${isVertical ? 'Y' : 'X'}(${offset}px)`,
        [isVertical ? 'height' : 'width']: `${this.size * this.childrenCount}px`,
        [isVertical ? 'width' : 'height']: `${isVertical ? this.internalWidth : this.internalHeight}px`,
      }
    },
    resetPosition() {
      this.moving = true
      const { childrenCount } = this
      if (this.active <= -1) {
        this.move({ pace: childrenCount })
      } else if (this.active >= childrenCount) {
        this.move({ pace: -childrenCount })
      }
    },
    handlePrev() {
      this.resetPosition()
      this.touch.reset()
      requestFrame(() => {
        requestFrame(() => {
          this.moving = false
          this.move({ pace: -1, isEmit: true })
        })
      })
    },
    handleNext() {
      this.resetPosition()
      this.touch.reset()
      requestFrame(() => {
        requestFrame(() => {
          this.moving = false
          this.move({ pace: 1, isEmit: true })
        })
      })
    },
    handleTo(index) {
      this.resetPosition()
      this.touch.reset()
      requestFrame(() => {
        requestFrame(() => {
          this.moving = false
          let targetIndex
          if (this.loop && this.childrenCount) {
            targetIndex = this.active === 0 ? 0 : index
          } else {
            targetIndex = index % this.childrenCount
          }
          this.move({ pace: targetIndex - this.active, isEmit: true })
        })
      })
    },
    startAutoPlay() {
      if (this.autoPlay <= 0 || this.childrenCount <= 1) return
      this.stopAutoPlay()
      this.autoPlayTimer = setTimeout(() => {
        this.handleNext()
        this.startAutoPlay()
      }, Number(this.autoPlay))
    },
    stopAutoPlay() {
      clearTimeout(this.autoPlayTimer)
    },
    init(active = this.initPage) {
      active = Math.min(this.childrenCount - 1, active)
      this.stopAutoPlay()
      const rect = this.$refs.container.getBoundingClientRect()
      this.rect = rect
      this.internalWidth = this.width ? +this.width : rect.width
      this.internalHeight = this.height ? +this.height : rect.height
      this.active = active
      this.offset = this.getOffset(active)
      this.moving = true
      this.getStyle()

      this.startAutoPlay()
    },
    move({ offset = 0, pace = 0, isEmit = false }) {
      if (this.childrenCount <= 1) return
      const { active } = this
      const targetActive = this.getActive(pace)
      const targetOffset = this.getOffset(targetActive, offset)
      if (this.loop) {
        const firstChild = this.children[0]
        const lastChild = this.children[this.childrenCount - 1]
        if (firstChild && targetOffset !== this.minOffset) {
          const rightBound = targetOffset < this.minOffset
          firstChild.setOffset(rightBound ? this.trackSize : 0)
        }
        if (lastChild && targetOffset !== 0) {
          const leftBound = targetOffset > 0
          lastChild.setOffset(leftBound ? -this.trackSize : 0)
        }
      }
      this.active = targetActive
      this.offset = targetOffset
      if (isEmit && active !== this.active) {
        this.$emit('change', this.activePagination)
      }
      this.getStyle()
    },
  },
}
</script>

<style lang="less">
@import './swiper.less';
</style>
