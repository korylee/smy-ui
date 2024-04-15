<template>
  <div
    ref="root"
    :class="bem({ '$--safe-area-bottom': safeAreaInsetBottom })"
    :style="rootStyle"
    @touchstart.passive="onTouchstart"
    @touchmove="onTouchmove"
    @touchend="onTouchend"
    @touchcancel="onTouchend"
  >
    <div :class="bem('header')"><div :class="bem('header-bar')"></div></div>
    <div ref="content" :class="bem('content')"><slot /></div>
  </div>
</template>
<script>
import { createProxiedModel } from '../_mixins/proxiedModel'
import { useTouch } from '../_utils/composable/useTouch'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import { convertToUnit, preventDefault } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'

const [name, bem] = createNamespace('floating-panel')

const WindowSize = useWindowSize()

const DAMP = 0.2

const closest = (arr, target) =>
  arr.reduce((prev, cur) => (Math.abs(prev - target) < Math.abs(cur - target) ? prev : cur))

export default {
  name,
  mixins: [createProxiedModel('height', 'modelHeight', { event: 'update:height' })],
  props,
  data: () => ({
    touch: useTouch(),
    dragging: false,
    maxScroll: -1,
  }),
  computed: {
    boundary({ anchors }) {
      return {
        min: anchors[0] ?? 100,
        max: anchors[anchors.length - 1] ?? Math.round(WindowSize.height * 0.6),
      }
    },
    rootStyle({ boundary, modelHeight, dragging, duration }) {
      return {
        height: convertToUnit(boundary.max),
        transform: `translateY(calc(100% - ${convertToUnit(modelHeight)}))`,
        transition: !dragging ? `transform ${duration}s cubic-bezier(0.18, 0.89, 0.32, 1.28)` : 'none',
      }
    },
    closestHeight({ anchors, boundary, modelHeight }) {
      const _anchors = anchors.length >= 2 ? anchors : [boundary.min, boundary.max]
      return closest(_anchors, modelHeight)
    },
  },
  watch: {
    boundary: {
      immediate: true,
      handler() {
        this.modelHeight = this.closestHeight
      },
    },
  },
  methods: {
    bem,
    ease(moveY) {
      const absDistance = Math.abs(moveY)
      const { min, max } = this.boundary
      if (absDistance > max) {
        return -(max + (absDistance - max) * DAMP)
      }
      if (absDistance < min) {
        return -(min - (min - absDistance) * DAMP)
      }
      return moveY
    },
    onTouchstart(e) {
      this.touch.start(e)
      this.dragging = true
      this.startY = -this.modelHeight
      this.maxScroll = -1
    },
    onTouchmove(e) {
      const {
        touch,
        $refs: { content },
        contentDraggable,
      } = this
      touch.move(e)
      const target = e.target
      if (content === target || content?.contains(target)) {
        const { scrollTop } = content
        this.maxScroll = Math.max(this.maxScroll, scrollTop)
        if (!contentDraggable) return
        if (-this.startY < this.boundary.max) {
          preventDefault(e)
        } else if (!(scrollTop <= 0 && touch.start.deltaY > 0) || this.maxScroll > 0) {
          return
        }
      }

      const moveY = touch.state.deltaY + this.startY
      this.modelHeight = -this.ease(moveY)
    },
    onTouchend() {
      this.maxScroll = -1
      this.dragging = false
      this.modelHeight = this.closestHeight
      if (this.modelHeight !== -this.startY) {
        this.$emit('height-change', { height: this.modelHeight })
      }
    },
  },
}
</script>

<style lang="less">
@import '../_styles/common.less';
@import './floatingPanel.less';
</style>
