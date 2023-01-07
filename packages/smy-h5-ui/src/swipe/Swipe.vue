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
import { useTouch } from '../_utils/vue/useTouch'
import { props } from './props'

export default {
  name: 'SmySwipe',
  props,
  data: () => ({
    offset: 0,
    opened: false,
    moving: false,
    position: '',
    oldPosition: '',
    touch: useTouch(),
  }),
  computed: {
    touchStyle() {
      return { transform: `translate3d(${this.offset}px, 0, 0)` }
    },
    rightRefWidth() {
      return this.getRefWidth(this.$refs.rightRef)
    },
    leftRefWidth() {
      return this.getRefWidth(this.$refs.leftRef)
    },
  },
  methods: {
    open(position) {
      this.opened = true
      if (position) {
        this.offset = position === 'left' ? -this.rightRefWidth : this.leftRefWidth
      }
      this.$emit('open', { position: this.position || position })
    },
    close() {
      this.offset = 0
      this.opened = false
      this.$emit('close', { position: this.position })
    },
    getRefWidth(ref) {
      return ref?.clientWidth || 0
    },
    setOffset(deltaX) {
      this.position = deltaX > 0 ? 'right' : 'left'
      let offset = deltaX
      const { rightRefWidth, position, oldPosition, leftRefWidth } = this
      switch (position) {
        case 'left':
          if (this.opened && oldPosition === position) {
            offset = -rightRefWidth
          } else {
            offset = Math.abs(deltaX) > rightRefWidth ? -rightRefWidth : deltaX
          }
          break
        case 'right': {
          if (this.opened && oldPosition === position) {
            offset = leftRefWidth
          } else {
            offset = Math.abs(deltaX) > leftRefWidth ? leftRefWidth : deltaX
          }
        }
      }
      this.offset = offset
    },
    onTouchStart(event) {
      if (this.disabled) return
      this.touch.start(event)
    },
    onTouchMove(event) {
      if (this.disabled) return
      const { touch } = this
      touch.move(event)
      if (touch.isHorizontal()) {
        this.moving = true
        this.setOffset(touch.state.deltaX)
      }
    },
    onTouchEnd() {
      if (!this.moving) return
      this.moving = false
      this.oldPosition = this.position
      const { rightRefWidth, leftRefWidth } = this
      const offsetDenominator = this.opened ? 1.2 : 2
      switch (this.position) {
        case 'left':
          if (Math.abs(this.offset) <= rightRefWidth / offsetDenominator) {
            this.close()
          } else {
            this.offset = -rightRefWidth
            this.open()
          }
          break
        case 'right':
          if (Math.abs(this.offset) <= leftRefWidth / offsetDenominator) {
            this.close()
          } else {
            this.offset = leftRefWidth
            this.open()
          }
          break
      }
    },
  },
}
</script>

<style lang="less">
@import './swipe.less';
</style>
