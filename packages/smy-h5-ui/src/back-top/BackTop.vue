<template>
  <div ref="root" :class="bem('wrap')">
    <smy-teleport :to="teleport">
      <div
        :class="bem({ active: show })"
        :style="{ zIndex, right, bottom }"
        v-bind="$attrs"
        v-on="$listeners"
        @click="onClick"
      >
        <slot><smy-icon :class="bem('icon')" name="chevron-up" /></slot>
      </div>
    </smy-teleport>
  </div>
</template>

<script>
import { IN_BROWSER, getScrollTop, getParentScroller, getElement, throttle } from '@smy-h5/shared'
import { createNamespace } from '../_utils/vue/create'
import { onMountedOrActivated } from '../_utils/vue/lifetime'
import SmyTeleport from '../teleport'
import { props } from './props'
import SmyIcon from '../icon'
import ChevronUp from '@smy-h5/icons/dist/es/ChevronUp'

SmyIcon.use('chevron-up', ChevronUp)

const [name, bem] = createNamespace('back-top')

export default {
  name,
  props,
  inheritAttrs: false,
  components: {
    SmyTeleport,
    SmyIcon,
  },
  data: () => ({
    show: false,
    scrollParent: null,
  }),
  created() {
    let attached = false
    const onScroll = () => {
      const { scrollParent, offset } = this
      this.show = scrollParent ? getScrollTop(scrollParent) >= +offset : false
    }
    const scroll = throttle(onScroll, 100)
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
    const updateTarget = () => {
      if (!IN_BROWSER) return
      this.$nextTick(() => {
        const { target } = this
        const newScrollParent = target ? getElement(target) : getParentScroller(this.$refs.root)
        add(newScrollParent)
        remove(this.scrollParent)
        this.scrollParent = newScrollParent
        onScroll()
      })
    }
    this.$on('hook:mounted', () => {
      this.$watch('target', updateTarget, { immediate: true })
    })
    this.$on(['hook:deactivated', 'hook:beforeDestory'], remove)
  },
  methods: {
    bem,
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
