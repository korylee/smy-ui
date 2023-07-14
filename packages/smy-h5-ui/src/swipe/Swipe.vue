<template>
  <div
    class="smy-swipe"
    :style="touchStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div ref="leftRef" :class="bem('left')">
      <slot name="left" />
    </div>
    <div :class="bem('content')">
      <slot name="default" />
    </div>
    <div ref="rightRef" :class="bem('right')">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import { props } from './props'
import { useTouch } from '../_utils/composable/useTouch'
import { range } from '../_utils/shared'
import { computed, defineComponent, ref } from 'vue'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('swipe')
const getRefWidth = (ref) => ref?.clientWidth || 0
const THRESHOLD = 0.15

export default defineComponent({
  name,
  props,
  emits: ['close', 'open'],
  setup(props, { emit, expose }) {
    let opened = false
    let startOffset = 0
    const offset = ref(0)
    const touching = ref(false)
    const rightRef = ref(null)
    const leftRef = ref(null)

    const touch = useTouch()

    const touchStyle = computed(() => ({
      transform: `translate3d(${offset.value}px, 0, 0)`,
      transitionDuration: touching.value ? '0s' : '.6s',
    }))
    const rightRefWidth = computed(() => getRefWidth(rightRef.value))
    const leftRefWidth = computed(() => getRefWidth(leftRef.value))

    function open(position) {
      opened = true
      offset.value = position === 'left' ? -rightRefWidth.value : leftRefWidth.value
      emit('open', { position })
    }
    function close(position) {
      offset.value = 0
      opened = false
      emit('close', { position })
    }

    expose({ open, close })

    return {
      rightRef,
      leftRef,
      touchStyle,
      bem,
      onTouchStart(event) {
        startOffset = offset.value
        touch.start(event)
      },
      onTouchMove(event) {
        if (props.disabled) return
        const { move, isHorizontal, state } = touch
        move(event)
        if (isHorizontal()) {
          touching.value = true
          offset.value = range(state.deltaX + startOffset, -rightRefWidth.value, leftRefWidth.value)
        }
      },
      onTouchEnd() {
        if (!touching.value) return
        touching.value = false
        const isRight = touch.state.deltaX > 0
        const position = isRight ? 'right' : 'left'
        const threshold = opened ? 1 - THRESHOLD : THRESHOLD
        const width = isRight ? leftRefWidth.value : rightRefWidth.value

        if (width && Math.abs(offset.value) > width * threshold) {
          open(position)
        } else {
          close(position)
        }
      },
    }
  },
})
</script>

<style lang="less">
@import './swipe.less';
</style>
