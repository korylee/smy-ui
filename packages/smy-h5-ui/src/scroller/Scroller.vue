<template>
  <div ref="scroller" class="smy-scroller">
    <div class="smy-scroller__container"><slot /></div>
    <div class="smy-scroller__control">
      <div v-if="isInfiniting" class="smy-scroller__control-loading">
        <slot name="loading">
          <slot name="loading-icon"><smy-loading class="smy-scroller__control-loading__icon" /></slot>
          <div class="smy-scroller__control-loading__text">{{ loadText }}</div>
        </slot>
      </div>
      <slot v-else-if="!hasMore" name="finished"
        ><div v-if="loadMoreText" class="smy-scroller__control-tips">{{ loadMoreText }}</div></slot
      >
    </div>
  </div>
</template>

<script>
import { getParentScroller, getScrollTopRoot, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import SmyLoading from '../loading'

const calculateTopPosition = (el) => (!el ? 0 : el.offsetTop + calculateTopPosition(el.offsetParent))

export default {
  name: 'SmyScroller',
  alias: ['SmyInfiniteLoading'],
  components: { SmyLoading },
  props,
  data: () => ({
    beforeScrollTop: 0,
    isInfiniting: null,
    x: 0,
    y: 0,
    distance: 0,
  }),
  watch: {
    value(val) {
      if (val) return
      this.isInfiniting = false
    },
  },
  created() {
    let scrollParent = null
    let resScrollTop = 0
    const isScrollAtBootom = () => {
      let offsetDistance = 0
      const { scroller } = this.$refs
      if (scrollParent === window) {
        const windowScrollTop = getScrollTopRoot()
        if (scroller) {
          offsetDistance = calculateTopPosition(scroller) + scroller.offsetHeight - windowScrollTop - window.innerHeight
          resScrollTop = windowScrollTop
        }
      } else {
        const { scrollHeight, clientHeight, scrollTop } = scrollParent

        offsetDistance = scrollHeight - clientHeight - scrollTop
        resScrollTop = scrollTop
      }
      const isDown = this.beforeScrollTop <= resScrollTop
      this.beforeScrollTop = resScrollTop
      this.$emit('scroll-change', resScrollTop)
      return offsetDistance <= this.threshold && isDown
    }
    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (!isScrollAtBootom() || !this.hasMore || this.isInfiniting) return false
        this.isInfiniting = true
        this.$emit('input', true)
        this.$nextTick(() => {
          this.$emit('load-more')
        })
      })
    }
    const scrollListener = () => {
      scrollParent?.addEventListener('scroll', handleScroll, this.useCapture)
    }
    const removeScrollListener = () => {
      scrollParent?.removeEventListener('scroll', handleScroll, this.useCapture)
    }
    this.$once('hook:mounted', () => {
      scrollParent = getParentScroller(this.$refs.scroller)
      scrollListener()
    })
    this.$once('hook:beforeDestroy', removeScrollListener)
  },
}
</script>

<style lang="less">
@import '../loading/loading.less';
@import './scroller.less';
</style>
