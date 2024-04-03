<template>
  <div
    ref="root"
    :class="bem()"
    :style="touchStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div ref="leftRef" :class="bem('left')">
      <slot name="left"></slot>
    </div>
    <div :class="bem('content')">
      <slot name="default" />
    </div>
    <div ref="rightRef" :class="bem('right')">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import { props } from './props'
import { useTouch } from '../_utils/composable/useTouch'
import { createNamespace } from '../_utils/vue/create'
import { getElement, range } from '@smy-h5/shared'

const [name, bem] = createNamespace('swipe')
const getRefWidth = (ref) => ref?.clientWidth || 0
const THRESHOLD = 0.15

const useClickAway = (vm, target, callback) => {
  const onClick = (event) => {
    target = getElement(target)
    const isClickAway = target && !target.contains(event.target)
    if (!isClickAway) {
      return
    }
    callback()
  }
  vm.$on('hook:mounted', () => {
    document.addEventListener('touchstart', onClick)
  })
  vm.$on('hook:beforeDestory', () => {
    document.removeEventListener('touchstart', onClick)
  })
}

export default {
  name,
  props,
  data: () => ({
    offset: 0,
    opened: false,
    touching: false,
    startOffset: 0,
    touch: useTouch(),
  }),
  computed: {
    touchStyle({ touching, offset }) {
      return {
        transform: `translate3d(${offset}px, 0, 0)`,
        transitionDuration: touching ? '0s' : '.6s',
      }
    },
    rightRefWidth() {
      return getRefWidth(this.$refs.rightRef)
    },
    leftRefWidth() {
      return getRefWidth(this.$refs.leftRef)
    },
  },
  created() {
    useClickAway(
      this,
      () => this.$refs.root,
      () => this.close('outside'),
    )
  },
  methods: {
    bem,
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
