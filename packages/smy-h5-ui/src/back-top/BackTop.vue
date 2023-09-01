<template>
  <div ref="root" :class="bem('wrap')">
    <maybe-teleport :maybe="!!teleport" :to="teleport">
      <div :class="bem({ active: show })" :style="style" v-bind="$attrs" v-on="$listeners" @click="onClick">
        <slot>
          <smy-icon :class="bem('icon')"> <chevron-up /> </smy-icon>
        </slot>
      </div>
    </maybe-teleport>
  </div>
</template>

<script>
import { getScrollTop } from '../_utils/dom'
import { getParentScroller, getTargetElement } from '../_utils/dom'
import { IN_BROWSER } from '../_utils/env'
import { throttle } from '../_utils/shared'
import { createNamespace } from '../_utils/vue/create'
import { onMountedOrActivated } from '../_utils/vue/lifetime'
import { MaybeTeleport } from '../teleport'
import { props } from './props'
import SmyIcon from '../icon'
import ChevronUp from '@smy-h5/icons/dist/es/ChevronUp'

const [name, bem] = createNamespace('back-top')

export default {
  name,
  props,
  inheritAttrs: false,
  components: {
    MaybeTeleport,
    SmyIcon,
    ChevronUp,
  },
  data: () => ({
    show: false,
    scrollParent: null,
  }),
  computed: {
    style({ zIndex, right, bottom }) {
      return { zIndex, right, bottom }
    },
  },
  watch: {
    target: 'updateTarget',
  },
  created() {
    let attached = false
    const scroll = throttle(this.onScroll, 100)
    const add = (element) => {
      if (element && !attached) {
        element.addEventListener('scroll', scroll)
        attached = true
      }
    }
    const remove = (element) => {
      if (element) {
        element.removeEventListener('scroll', scroll)
        attached = false
      }
    }
    onMountedOrActivated(this, add)
    this.$on(['hook:deactivated', 'hook:beforeDestory'], remove)
    this.$watch('scrollParent', (val, oldVal) => {
      add(val)
      remove(oldVal)
    })
  },
  mounted() {
    this.updateTarget()
  },
  methods: {
    bem,
    updateTarget() {
      if (!IN_BROWSER) return
      this.$nextTick(() => {
        const { target } = this
        this.scrollParent = target ? getTargetElement(target) : getParentScroller(this.$refs.root)
        this.onScroll()
      })
    },
    onScroll() {
      const { scrollParent, offset } = this
      this.show = scrollParent ? getScrollTop(scrollParent) >= +offset : false
    },
    onClick(event) {
      this.$emit('click', event)
      this.scrollParent?.scrollTo({
        top: 0,
        behavior: this.immediate ? 'auto' : 'smooth',
      })
    },
  },
}
</script>

<style lang="less">
@import './backTop.less';
</style>
