<template>
  <div ref="root" :class="bem({ vertical })">
    <div
      ref="track"
      :class="bem('track')"
      :style="style"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot />
    </div>
    <slot name="indicator" :index="activeIndex" :length="count">
      <div v-if="indicator" :class="bem('indicator')">
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
import { toNumber, range, throttle } from '../_utils/shared'
import { toPxNum, doubleRaf, preventDefault, isHidden } from '../_utils/dom'
import { useTouch } from '../_utils/composable/useTouch'
import { props } from './props'
import { createNamespace } from '../_utils/vue/create'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import { PopupMixin } from '../popup/provide'
import { usePageHidden } from '../_utils/composable/usePageHidden'

const [name, bem] = createNamespace('swiper')

export default {
  name,
  mixins: [createParentMixin('swiper'), PopupMixin],
  props,
  data: () => ({
    touch: useTouch(),
    active: 0,
    rect: null,
    moving: false,
    offset: 0,
    touchTime: 0,
    autoplayTimer: null,
    style: {},
  }),
  computed: {
    isCorrectDirection(vm) {
      return vm.touch?.isVertical() === !!vm.vertical
    },
    size({ vertical, height, width, rect }) {
      if (vertical) return toPxNum(height ?? rect?.height ?? 0)
      return toPxNum(width ?? rect?.width ?? 0)
    },
    count({ children }) {
      return children.length
    },
    trackSize({ count, size }) {
      return count * size
    },
    minOffset({ rect, vertical, trackSize }) {
      if (rect) {
        const base = rect[vertical ? 'height' : 'width']
        return base - trackSize
      }
      return 0
    },
    activeIndex({ count, active }) {
      return (active + count) % count
    },
    delta({ touch, vertical }) {
      if (!touch) return 0
      return touch.state[vertical ? 'deltaY' : 'deltaX']
    },
  },
  created() {
    const vm = this

    const resize = throttle(() => vm.init(), 300)
    const windowSize = useWindowSize()
    vm.$watch(() => {
      const { initialIndex, count } = vm
      return [initialIndex, count, windowSize.width]
    }, resize)

    const { stopAutoplay, startAutoplay } = vm
    const pageHidden = usePageHidden()
    vm.$watch(
      () => pageHidden.value,
      (val) => (val ? stopAutoplay() : startAutoplay()),
    )
    vm.$watch('autoplay', (val) => {
      val > 0 ? startAutoplay() : stopAutoplay()
    })
    vm.$once('hook:beforeDestroy', stopAutoplay)
    vm.$on('hook:deactivated', stopAutoplay)
    vm.popupProvider?.$on('show', resize)
    vm.popupProvider?.$on('close', stopAutoplay)
  },
  methods: {
    bem,
    onTouchStart(e) {
      if (!this.touchable || this.children.length <= 1 || e.touches.length > 1) return
      this.touch.start(e)
      this.touchTime = Date.now()
      this.stopAutoplay()
      this.resetPosition()
    },
    onTouchMove(e) {
      const vm = this
      if (!vm.touchable || !vm.moving) return
      vm.touch.move(e)
      if (!vm.isCorrectDirection) return
      const { delta, loop, active, count } = vm

      const isEdgeTouch = !loop && ((active <= 0 && delta > 0) || (active >= count - 1 && delta < 0))
      if (isEdgeTouch) return
      if (vm.isPreventDefault) preventDefault(e)
      if (vm.isStopPropagation) e.stopPropagation()

      vm.move({ offset: delta })
    },
    onTouchEnd() {
      const { delta, size, touchable, moving, touchTime, touch, isCorrectDirection, vertical } = this
      if (!touchable || !moving) return
      const speed = delta / (Date.now() - touchTime)
      const shouldMove = Math.abs(speed) > 0.3 || Math.abs(delta) > +(size / 2).toFixed(2)
      if (shouldMove && isCorrectDirection) {
        let pace = 0
        const offset = touch.state[vertical ? 'offsetY' : 'offsetX']
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
      const { active, count } = this
      if (pace) {
        if (this.loop) {
          return range(active + pace, -1, count)
        }
        return range(active + pace, 0, count - 1)
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
      const { vertical, size, count, rect, duration, moving, center, trackSize } = this
      if (!center) {
        offset = this.offset
      } else {
        const diff = (vertical ? rect.height : rect.width) - size
        offset = this.offset + (this.active === count - 1 ? -diff / 2 : diff / 2)
      }
      const crossName = vertical ? 'width' : 'height'
      const crossAxis = toPxNum(this[crossName] ?? rect[crossName] ?? 0)
      this.style = {
        transitionProperty: moving ? 'none' : undefined,
        transitionDuration: `${moving ? 0 : duration}ms`,
        transform: `translate${vertical ? 'Y' : 'X'}(${offset}px)`,
        [vertical ? 'height' : 'width']: trackSize ? `${trackSize}px` : '',
        [crossName]: crossAxis ? `${crossAxis}px` : '',
      }
    },
    resetPosition() {
      this.moving = true
      const { count, active } = this
      if (active <= -1) {
        this.move({ pace: count })
      } else if (active >= count) {
        this.move({ pace: -count })
      }
    },
    reset(cb) {
      this.resetPosition()
      this.touch.reset()
      return doubleRaf(() => {
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
        const { count, active } = this
        let targetIndex
        if (this.loop && count === index) {
          targetIndex = active === 0 ? 0 : index
        } else {
          targetIndex = index % count
        }
        this.moving = false
        this.move({ pace: targetIndex - active, isEmit: true })
      })
    },
    startAutoplay() {
      const { autoplay } = this
      if (autoplay <= 0 || this.count <= 1) return
      this.stopAutoplay()
      this.autoplayTimer = setTimeout(() => {
        this.next()
        this.startAutoplay()
      }, toNumber(autoplay))
    },
    stopAutoplay() {
      clearTimeout(this.autoplayTimer)
    },
    init(active = this.initialIndex) {
      const { root } = this.$refs
      if (!root) return
      // eslint-disable-next-line vue/valid-next-tick
      const nextTick = isHidden(root) ? this.$nextTick() : Promise.resolve()
      nextTick.then(() => {
        const { count, children } = this
        if (!isHidden(root)) {
          const rect = {
            width: root.offsetWidth,
            height: root.offsetHeight,
          }
          this.rect = rect
        }
        if (count) {
          active = Math.min(count - 1, Number(active))
          if (active === -1) {
            active = count - 1
          }
        }
        this.active = active
        this.moving = true
        this.offset = this.getOffset(active)
        children.forEach((item) => {
          item.setOffset(0)
        })
        this.getStyle()
        this.startAutoplay()
      })
    },
    move({ offset = 0, pace = 0, isEmit = false }) {
      const { count, active, children, minOffset, trackSize } = this
      if (count <= 1) return
      const targetActive = this.getActive(pace)
      const targetOffset = this.getOffset(targetActive, offset)
      if (this.loop) {
        const firstChild = children[0]
        const lastChild = children[count - 1]
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
        this.$emit('change', this.activeIndex)
      }
      this.getStyle()
    },
  },
}
</script>

<style lang="less">
@import './swiper.less';
</style>
