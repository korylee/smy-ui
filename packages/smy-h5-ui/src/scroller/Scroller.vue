<template>
  <div ref="scroller" v-intersect="onIntersect" class="smy-scroller">
    <div :class="bem('container')"><slot /></div>
    <div class="smy-scroller__control">
      <div v-if="isInfiniting" class="smy-scroller__control-loading">
        <slot name="loading">
          <slot name="loading-icon"
            ><smy-progress-circular indeterminate width="1.4" class="smy-scroller__control-loading__icon"
          /></slot>
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
import { getScrollTopRoot, requestAnimationFrame } from '../_utils/dom'
import { props } from './props'
import SmyProgressCircular from '../progress-circular'
import { createNamespace } from '../_utils/vue/create'
import { useScrollParent } from '../_hooks/useScrollParent'
import { defineComponent, ref, unref, watch, nextTick } from 'vue'
import { useEventListener } from '../_hooks/useEventListener'
import Intersect from '../intersect'

const calculateTopPosition = (el) => (!el ? 0 : el.offsetTop + calculateTopPosition(el.offsetParent))

const [name, bem] = createNamespace('scroller')

export default defineComponent({
  name,
  components: { SmyProgressCircular },
  props,
  emits: ['scroll-change', 'load-more', 'update:modelValue'],
  directives: { Intersect },
  setup(props, { emit }) {
    let beforeScrollTop = 0
    let resScrollTop = 0
    const isInfiniting = ref(false)
    const scroller = ref(null)
    const scrollParent = useScrollParent(scroller)

    const isScrollAtBootom = () => {
      let offsetDistance = 0
      const scrollerEl = unref(scroller)
      const scrollParentEl = unref(scrollParent)
      if (scrollParentEl === window) {
        const windowScrollTop = getScrollTopRoot()
        if (scrollerEl) {
          offsetDistance =
            calculateTopPosition(scrollerEl) + scrollerEl.offsetHeight - windowScrollTop - window.innerHeight
          resScrollTop = windowScrollTop
        }
      } else {
        const { scrollHeight, clientHeight, scrollTop } = scrollParentEl
        offsetDistance = scrollHeight - clientHeight - scrollTop
        resScrollTop = scrollTop
      }
      const isDown = beforeScrollTop <= resScrollTop
      beforeScrollTop = resScrollTop
      emit('scroll-change', resScrollTop)
      return offsetDistance <= props.threshold && isDown
    }
    const onScroll = () => {
      requestAnimationFrame(() => {
        if (!isScrollAtBootom() || !props.hasMore || isInfiniting.value) {
          return false
        }
        isInfiniting.value = true
        emit('update:modelValue', true)
        nextTick(() => {
          emit('load-more')
        })
      })
    }

    watch(
      () => props.modelValue,
      (val) => !val && (isInfiniting.value = false)
    )
    useEventListener('scroll', onScroll, {
      target: scrollParent,
      capture: props.useCapture,
    })

    return {
      scroller,
      isInfiniting,
      bem,
      onIntersect(...args) {
        console.log(args)
      },
    }
  },
})
</script>

<style lang="less">
@import '../progress-circular/progressCircular.less';
@import './scroller.less';
</style>
