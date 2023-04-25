<template>
  <div
    class="smy-swipe"
    :style="touchStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div ref="leftRef" class="smy-swipe__left">
      <slot name="left"></slot>
    </div>
    <div class="smy-swipe__content">
      <slot name="default" />
    </div>
    <div ref="rightRef" class="smy-swipe__right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import { useTouch } from '../_utils/composable/useTouch'
import { range } from '../_utils/shared'

const getRefWidth = (ref) => ref?.clientWidth || 0
const THRESHOLD = 0.15

export default {
  name: 'SmySwipe',
  props,
  data: () => ({
    offset: 0,
    opened: false,
    touching: false,
    startOffset: 0,
    touch: useTouch(),
  }),
  computed: {
    touchStyle() {
      return {
        transform: `translate3d(${this.offset}px, 0, 0)`,
        transitionDuration: this.touching ? '0s' : '.6s',
      }
    },
    rightRefWidth() {
      return getRefWidth(this.$refs.rightRef)
    },
    leftRefWidth() {
      return getRefWidth(this.$refs.leftRef)
    },
  },
  methods: {
    open(position) {
      this.opened = true
      this.offset = position === 'left' ? -this.rightRefWidth : this.leftRefWidth
      this.$emit('open', { position })
    },
    close(position) {
      this.offset = 0
      this.opened = false
      this.$emit('close', { position })
    },
    onTouchStart(event) {
      const { touch, offset } = this
      this.startOffset = offset
      touch.start(event)
    },
    onTouchMove(event) {
      if (this.disabled) return
      const { rightRefWidth, leftRefWidth, touch } = this
      const { move, isHorizontal, state } = touch
      move(event)
      if (isHorizontal()) {
        this.touching = true
        this.offset = range(state.deltaX + this.startOffset, -rightRefWidth, leftRefWidth)
      }
    },
    onTouchEnd() {
      if (!this.touching) return
      const {
        rightRefWidth,
        leftRefWidth,
        opened,
        touch: {
          state: { deltaX },
        },
      } = this
      this.touching = false
      const isRight = deltaX > 0
      const position = isRight ? 'right' : 'left'
      const threshold = opened ? 1 - THRESHOLD : THRESHOLD
      const width = isRight ? leftRefWidth : rightRefWidth
      const offset = Math.abs(this.offset)

      if (width && offset > width * threshold) {
        this.open(position)
      } else {
        this.close(position)
      }
    },
  },
}
</script>

<style lang="less">
@import './swipe.less';
</style>
