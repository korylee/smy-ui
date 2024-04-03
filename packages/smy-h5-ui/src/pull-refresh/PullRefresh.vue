<template>
  <div ref="scroller" :class="bem()" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div :class="bem('control-wrap')" :style="style">
      <slot name="header" :status="status" :distance="distance">
        <div :class="bem('control')" :style="headerStyle">
          <slot v-if="status === 'pulling'" name="pulling">
            <div :class="bem('control-text')">{{ pullingText }}</div>
          </slot>
          <slot v-else-if="status === 'loosing'" name="loosing">
            <div :class="bem('control-text')">{{ loosingText }}</div>
          </slot>
          <slot v-else-if="status === 'loading'" name="loading">
            <smy-progress-circular :class="bem('control-icon')" indeterminate width="1.4" />
            <div :class="bem('control-text')">{{ loadingText }}</div>
          </slot>
        </div>
      </slot>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { useTouch } from '../_utils/composable/useTouch'
import { getParentScroller, getRootScrollTop, toPxNum, convertToUnit } from '@smy-h5/shared'
import { props } from './props'
import SmyProgressCircular from '../progress-circular'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('pull-refresh')

export default {
  name,
  components: { SmyProgressCircular },
  props,
  data: () => ({
    touch: useTouch(),
    status: 'normal',
    scrollParent: null,
    isPullRefresh: false,
    distance: 0,
  }),
  computed: {
    style: ({ duration, distance }) => ({
      transitionDuration: convertToUnit(duration, 'ms'),
      transform: distance ? `translate3d(0, ${distance}px, 0)` : '',
    }),
    headerStyle({ headerHeight }) {
      const height = convertToUnit(headerHeight)
      return { height, lineHeight: height }
    },
    canTouch: ({ status }) => !['loading'].includes(status),
    internalPullDistance() {
      return toPxNum(this.pullDistance || this.headerHeight)
    },
  },
  watch: {
    value(val) {
      if (val === false) {
        this.setPullStatus(0)
      }
    },
  },
  mounted() {
    this.scrollParent = getParentScroller(this.$refs.scroller)
  },
  methods: {
    bem,
    timing(distance) {
      const { internalPullDistance: pullDistance } = this
      let moveDistance = distance
      if (distance > pullDistance) {
        if (distance < pullDistance * 2) {
          moveDistance = (distance + pullDistance) / 2
        } else {
          moveDistance = pullDistance + distance / 4
        }
      }
      return Math.round(moveDistance)
    },
    setPullStatus(distance, isLoading) {
      const { internalPullDistance: pullDistance } = this
      this.distance = distance
      const status = isLoading ? 'loading' : distance === 0 ? 'normal' : distance < pullDistance ? 'pulling' : 'loosing'
      this.status = status
      this.$emit('change', { status, distance })
    },
    isScrollTop() {
      const { scrollParent } = this
      if (scrollParent === window) return getRootScrollTop() === 0
      return scrollParent?.scrollTop === 0
    },
    onTouchStart(event) {
      if (!this.canTouch) return
      if (this.isScrollTop()) {
        this.touch.start(event)
        this.isPullRefresh = true
      } else {
        this.distance = 0
        this.isPullRefresh = false
      }
    },
    onTouchMove(event) {
      if (!this.canTouch) return
      const { touch } = this
      touch.move(event)
      const {
        state: { deltaY },
      } = touch
      if (touch.isVertical() && deltaY > 0 && this.isPullRefresh) {
        event.preventDefault()
        this.setPullStatus(this.timing(deltaY))
      }
    },
    onTouchEnd() {
      if (!this.isPullRefresh || !this.canTouch || !this.touch.state.deltaY) return
      if (this.status === 'loosing') {
        this.setPullStatus(toPxNum(this.headerHeight), true)
        this.$emit('input', true)
        this.$nextTick(() => this.$emit('refresh'))
      } else {
        this.setPullStatus(0)
      }
    },
  },
}
</script>

<style lang="less">
@import '../loading/loading.less';
@import './pullRefresh.less';
</style>
