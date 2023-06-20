<template>
  <div ref="container" :class="bem({ vertical })">
    <div
      class="smy-swiper__inner"
      :style="style"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot />
    </div>
    <slot name="indicator" :index="activeIndex" :length="childrenCount">
      <div v-if="indicator" class="smy-swiper__indicator">
        <i
          v-for="(item, index) of children"
          :key="item._uid"
          :class="bem('indicator-item', { active: activeIndex === index })"
          @click="to(index)"
        />
      </div>
    </slot>
    <slot name="extra" />
  </div>
</template>

<script>
import { createParentMixin } from '../_mixins/relation'
import { toNumber, range } from '../_utils/shared'
import { toPxNum, doubleRaf, getRect } from '../_utils/dom'
import { useTouch } from '../_utils/composable/useTouch'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('swiper')

export default {
  name,
  mixins: [createParentMixin('swiper')],
  props,
  data: () => ({
    touch: useTouch(),
    active: 0,
    rect: null,
    internalWidth: 0,
    internalHeight: 0,
    moving: false,
    offset: 0,
    touchTime: 0,
    autoplayTimer: null,
    style: {},
  }),
  computed: {
    isCorrectDirection({ touch, vertical }) {
      return touch?.state.direction === (vertical ? 'vertical' : 'horizontal')
    },
    size({ vertical, height, width }) {
      if (vertical) return toPxNum(height)
      return toPxNum(width)
    },
    childrenCount({ children }) {
      return children.length
    },
    trackSize({ childrenCount, size }) {
      return childrenCount * size
    },
    minOffset({ rect, vertical, trackSize }) {
      if (rect) {
        const base = rect[vertical ? 'height' : 'width']
        return base - trackSize
      }
      return 0
    },
    activeIndex({ childrenCount }) {
      return (this.active + childrenCount) % childrenCount
    },
    delta({ touch, vertical }) {
      if (!touch) return 0
      return touch.state[vertical ? 'deltaY' : 'deltaX']
    },
  },
  watch: {
    initialIndex() {
      this.$nextTick(this.init)
    },
    childrenCount() {
      this.$nextTick(this.init)
    },
    autoplay(val) {
      val > 0 ? this.startAutoplay() : this.stopAutoplay()
    },
  },
  created() {
    this.$once('hook:beforeDestroy', this.stopAutoplay)
    this.$on('hook:deactivated', this.stopAutoplay)
  },
  methods: {
    bem,
    onTouchStart(e) {
      if (this.isPreventDefault) e.preventDefault()
      if (this.isStopPropagation) e.stopPropagation()
      if (!this.touchable) return
      this.touch.start(e)
      this.touchTime = Date.now()
      this.stopAutoplay()
      this.resetPosition()
    },
    onTouchMove(e) {
      const { delta, touchable, moving, touch, isCorrectDirection } = this
      if (!touchable || !moving) return
      touch.move(e)
      if (isCorrectDirection) {
        this.move({ offset: delta })
      }
    },
    onTouchEnd() {
      const { delta, size, touchable, moving, touchTime, touch, isCorrectDirection } = this
      if (!touchable || !moving) return
      const speed = delta / (Date.now() - touchTime)
      const isShouldMove = Math.abs(speed) > 0.3 || Math.abs(delta) > +(size / 2).toFixed(2)
      if (isShouldMove && isCorrectDirection) {
        let pace = 0
        const offset = touch.state[this.vertical ? 'offsetY' : 'offsetX']
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
      this.startAutoplay()
    },
    getActive(pace) {
      const { active, childrenCount } = this
      if (pace) {
        if (this.loop) {
          return range(active + pace, -1, childrenCount)
        }
        return range(active + pace, 0, childrenCount - 1)
      }
      return active
    },
    getOffset(active, offset = 0) {
      const { minOffset, loop, size } = this
      let currentPosition = active * size
      if (!loop) {
        currentPosition = Math.min(currentPosition, -minOffset)
      }
      const targetOffset = offset - currentPosition

      if (!loop) {
        return range(targetOffset, minOffset, 0)
      }
      return targetOffset
    },
    getStyle() {
      let offset = 0
      const { vertical, size, childrenCount, rect, internalWidth, internalHeight, duration, moving, center } = this
      if (!center) {
        offset = this.offset
      } else {
        const diff = (vertical ? rect.height : rect.width) - size
        offset = this.offset + (this.active === childrenCount - 1 ? -diff / 2 : diff / 2)
      }
      this.style = {
        transitionDuration: `${moving ? 0 : duration}ms`,
        transform: `translate${vertical ? 'Y' : 'X'}(${offset}px)`,
        [vertical ? 'height' : 'width']: `${size * childrenCount}px`,
        [vertical ? 'width' : 'height']: `${vertical ? internalWidth : internalHeight}px`,
      }
    },
    resetPosition() {
      this.moving = true
      const { childrenCount, active } = this
      if (active <= -1) {
        this.move({ pace: childrenCount })
      } else if (active >= childrenCount) {
        this.move({ pace: -childrenCount })
      }
    },
    reset(cb) {
      this.resetPosition()
      this.touch.reset()
      doubleRaf(() => {
        this.moving = false
        return cb && cb()
      })
    },
    prev(step = 1) {
      this.reset(() => {
        this.move({ pace: -step, isEmit: true })
      })
    },
    next(step = 1) {
      this.reset(() => {
        this.move({ pace: step, isEmit: true })
      })
    },
    to(index) {
      this.reset(() => {
        const { childrenCount, active } = this
        let targetIndex
        if (this.loop && childrenCount === index) {
          targetIndex = active === 0 ? 0 : index
        } else {
          targetIndex = index % childrenCount
        }
        this.move({ pace: targetIndex - active, isEmit: true })
      })
    },
    startAutoplay() {
      if (this.autoplay <= 0 || this.childrenCount <= 1) return
      this.stopAutoplay()
      this.autoplayTimer = setTimeout(() => {
        this.next()
        this.startAutoplay()
      }, toNumber(this.autoplay))
    },
    stopAutoplay() {
      clearTimeout(this.autoplayTimer)
    },
    init(active = this.initialIndex) {
      active = Math.min(this.childrenCount - 1, Number(active))
      this.stopAutoplay()
      const rect = getRect(this.$refs.container)
      this.rect = rect
      const width = toPxNum(this.width)
      const height = toPxNum(this.height)
      this.internalWidth = width || rect.width
      this.internalHeight = height || rect.height
      this.active = active
      this.offset = this.getOffset(active)
      this.moving = true
      this.getStyle()

      this.startAutoplay()
    },
    move({ offset = 0, pace = 0, isEmit = false }) {
      const { childrenCount, active, children, minOffset, trackSize } = this
      if (childrenCount <= 1) return
      const targetActive = this.getActive(pace)
      const targetOffset = this.getOffset(targetActive, offset)
      if (this.loop) {
        const firstChild = children[0]
        const lastChild = children[childrenCount - 1]
        if (firstChild && targetOffset !== minOffset) {
          const rightBound = targetOffset < minOffset
          firstChild.setOffset(rightBound ? trackSize : 0)
        }
        if (lastChild && targetOffset !== 0) {
          const leftBound = targetOffset > 0
          lastChild.setOffset(leftBound ? -trackSize : 0)
        }
      }
      this.active = targetActive
      this.offset = targetOffset
      if (isEmit && active !== targetActive) {
        this.$nextTick(() => {
          this.$emit('change', this.activeIndex)
        })
      }
      this.getStyle()
    },
  },
}
</script>

<style lang="less">
@import './swiper.less';
</style>
