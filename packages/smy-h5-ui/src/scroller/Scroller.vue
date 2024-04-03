<template>
  <div ref="scroller" :class="bem()">
    <div :class="bem('container')"><slot /></div>
    <div :class="bem('control')">
      <div v-if="isInfiniting" :class="bem('loading')">
        <slot name="loading">
          <slot name="loading-icon"
            ><smy-progress-circular :class="bem('loading-icon')" indeterminate width="1.4"
          /></slot>
          <div :class="bem('loading-text')">{{ loadText }}</div>
        </slot>
      </div>
      <slot v-else-if="!hasMore" name="finished"
        ><div v-if="loadMoreText" :class="bem('finished')">{{ loadMoreText }}</div></slot
      >
    </div>
  </div>
</template>

<script>
import { getParentScroller, getRootScrollTop, raf } from '@smy-h5/shared'
import { props } from './props'
import SmyProgressCircular from '../progress-circular'
import { createNamespace } from '../_utils/vue/create'

const calculateTopPosition = (el) => (!el ? 0 : el.offsetTop + calculateTopPosition(el.offsetParent))

const [name, bem] = createNamespace('scroller')

export default {
  name,
  components: { SmyProgressCircular },
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
        const windowScrollTop = getRootScrollTop()
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
      raf(() => {
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
  methods: {
    bem,
  },
}
</script>

<style lang="less">
@import '../progress-circular/progressCircular.less';
@import './scroller.less';
</style>
