<template>
  <div ref="root" v-intersect="onScroll" :class="bem('wrap')" :style="rootStyle">
    <div :class="bem({ fixed: fixed && !isReset })" :style="stickyStyle">
      <slot />
    </div>
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { doubleRaf, getParentScroller, getRect, getRootScrollTop, getTargetElement, toPxNum } from '../_utils/dom'
import intersect from '../intersect'
import { props } from './props'
import { useWindowSize } from '../_utils/composable/useWindowSize'
import { onMountedOrActivated } from '../_utils/vue/lifetime'

const [name, bem] = createNamespace('sticky')

export default {
  name,
  props,
  directives: { intersect },
  data: () => ({
    fixed: false,
    width: 0,
    height: 0,
    transform: 0,
    isReset: false,
    windowSize: useWindowSize(),
  }),
  computed: {
    offset({ position, offsetTop, offsetBottom }) {
      return toPxNum(position === 'top' ? offsetTop : offsetBottom)
    },
    rootStyle({ isReset, fixed, height, width }) {
      if (isReset || !fixed) {
        return
      }
      return {
        width: `${width}px`,
        height: `${height}px`,
      }
    },
    stickyStyle({ isReset, fixed, height, width, zIndex, position, offset, transform }) {
      if (isReset || !fixed) {
        return
      }
      return {
        zIndex,
        width: `${width}px`,
        height: `${height}px`,
        [position]: `${offset}px`,
        transform: transform ? `transform3d(0, ${transform}px, 0)` : undefined,
      }
    },
  },
  watch: {
    fixed(value) {
      this.$emit('change', value)
    },
    windowSize() {
      const { root } = this.$refs
      if (!root || !this.fixed) {
        return
      }
      this.isReset = true
      this.$nextTick(() => {
        const rootRect = getRect(root)
        this.width = rootRect.width
        this.height = rootRect.height
        this.isReset = false
      })
    },
  },
  created() {
    let scroller
    const add = () => {
      doubleRaf(() => {
        scroller = getParentScroller(this.$refs.root)
        if (scroller !== window) {
          scroller.addEventListener('scroll', this.onScroll, { passive: true })
        }
        window.addEventListener('scroll', this.onScroll, { passive: true })
      })
    }
    const remove = () => {
      scroller !== window && scroller.removeEventListener('scroll', this.onScroll)
      window.removeEventListener('scroll', this.onScroll)
    }
    onMountedOrActivated(this, add)
    this.$on('hook:beforeDestory', remove)
    this.$on('hook:deactivated', remove)
  },
  methods: {
    bem,
    onScroll() {
      const { root } = this.$refs
      if (!root) return
      const { container: _container, position, offset } = this
      const container = getTargetElement(_container)
      const rootRect = getRect(root)
      const scrollTop = getRootScrollTop()
      this.width = rootRect.width
      this.height = rootRect.height
      if (position === 'top') {
        if (container) {
          const containerRect = getRect(container)
          const diff = containerRect.bottom - this.offset - this.height
          this.fixed = offset > rootRect.top && containerRect.bottom > 0
          this.transform = diff < 0 ? diff : 0
        } else {
          this.fixed = offset > rootRect.top
        }
      } else {
        const { clientHeight } = document.documentElement
        if (container) {
          const containerRect = getRect(container)
          const diff = clientHeight - containerRect.top - offset - this.height
          this.fixed = clientHeight - offset < rootRect.bottom && clientHeight > containerRect.top
          this.transform = diff < 0 ? -diff : 0
        } else {
          this.fixed = clientHeight - offset < rootRect.bottom
        }
      }
      this.$emit('scroll', { scrollTop, isFixed: this.fixed })
    },
  },
}
</script>

<style lang="less">
@import './sticky.less';
</style>
