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
import SmyTeleport from '../teleport'
import { props } from './props'
import SmyIcon from '../icon'
import ChevronUp from '@smy-h5/icons/dist/es/ChevronUp'
import { defineComponent, ref, nextTick, onMounted, watch, onUnmounted, onDeactivated, onActivated } from 'vue'

SmyIcon.use('chevron-up', ChevronUp)

const [name, bem] = createNamespace('back-top')

function onMountedOrActivated(cb) {
  let mounted = false
  onMounted(() => {
    cb()
    nextTick(() => {
      mounted = true
    })
  })
  onActivated(() => {
    mounted && cb()
  })
}

export default defineComponent({
  name,
  props,
  inheritAttrs: false,
  components: {
    SmyTeleport,
    SmyIcon,
  },
  setup(props, { emit }) {
    let scrollParent
    let attached = false
    const show = ref(false)
    const root = ref()

    const onClick = (event) => {
      emit('click', event)
      scrollParent?.scrollTo({
        top: 0,
        behavior: props.immediate ? 'auto' : 'smooth',
      })
    }
    const onScroll = () => {
      show.value = scrollParent ? getScrollTop(scrollParent) >= +props.offset : false
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
    const updateTarget = () => {
      if (!IN_BROWSER) return
      nextTick(() => {
        const { target } = props
        const newScrollParent = target ? getElement(target) : getParentScroller(root.value)
        add(newScrollParent)
        remove(scrollParent)
        scrollParent = newScrollParent
        onScroll()
      })
    }
    onMounted(() => {
      watch(() => props.target, updateTarget, { immediate: true })
    })
    onMountedOrActivated(add)
    onUnmounted(remove)
    onDeactivated(remove)
    return { root, show, bem, onClick }
  },
})
</script>

<style lang="less">
@import './backTop.less';
</style>
