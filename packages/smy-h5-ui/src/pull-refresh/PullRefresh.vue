<template>
  <div
    class="smy-pull-refresh"
    ref="scroller"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="smy-pull-refresh-control" :style="style">
      <slot name="header" :status="status" :distance="distance">
        <div class="smy-pull-refresh-control__header" :style="headerStyle">
          <slot v-if="status === 'pulling'" name="pulling">
            <div class="smy-pull-refresh-control__header-text">{{ pullingText }}</div>
          </slot>
          <slot v-else-if="status === 'loosing'" name="loosing">
            <div class="smy-pull-refresh-control__header-text">{{ loosingText }}</div>
          </slot>
          <slot v-else-if="status === 'loading'" name="loading">
            <smy-loading class="smy-pull-refresh-control__header-icon" />
            <div class="smy-pull-refresh-control__header-text">{{ loadingText }}</div>
          </slot>
        </div>
      </slot>
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { useTouch } from '../_utils/composable/useTouch'
import { getParentScroller, getScrollTopRoot } from '../_utils/dom'
import { toPxNum, convertToUnit } from '../_utils/shared'
import { props } from './props'
import SmyLoading from '../loading'

export default {
  name: 'SmyPullRefresh',
  components: { SmyLoading },
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
      transitionDuration: `${duration}s`,
      transform: distance ? `translate3d(0, ${distance}px, 0)` : '',
    }),
    headerStyle: ({ headerHeight }) => ({ height: convertToUnit(headerHeight) }),
    isCanTouch: ({ status }) => !['loading'].includes(status),
  },
  watch: {
    value(val) {
      if (val) {
        this.$nextTick(() => this.$emit('refresh'))
      } else {
        this.setPullStatus(0)
      }
    },
  },
  mounted() {
    this.scrollParent = getParentScroller(this.$refs.scroller)
  },
  methods: {
    timing(distance) {
      const pullDistance = toPxNum(this.pullDistance || this.headerHeight)
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
      const pullDistance = toPxNum(this.pullDistance || this.headerHeight)
      this.distance = distance
      const status = isLoading ? 'loading' : distance === 0 ? 'normal' : distance < pullDistance ? 'pulling' : 'loosing'
      this.status = status
      this.$emit('change', { status, distance })
    },
    isScrollTop() {
      const { scrollParent } = this
      if (scrollParent === window) return getScrollTopRoot() === 0
      return scrollParent?.scrollTop === 0
    },
    onTouchStart(event) {
      if (!this.isCanTouch) return
      if (this.isScrollTop()) {
        this.touch.start(event)
        this.isPullRefresh = true
      } else {
        this.distance = 0
        this.isPullRefresh = false
      }
    },
    onTouchMove(event) {
      if (!this.isCanTouch) return
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
      if (!this.isPullRefresh || !this.isCanTouch || !this.touch.state.deltaY) return
      if (this.status === 'loosing') {
        this.setPullStatus(toPxNum(this.headerHeight), true)
        this.$emit('input', true)
        this.$nextTick(() => this.$emit('refresh'))
      } else {
        this.setPullStatus(0)
      }
      requestAnimationFrame(() => this.touch.reset())
    },
  },
}
</script>

<style lang="less">
@import '../loading/loading.less';
@import './pullRefresh.less';
</style>
