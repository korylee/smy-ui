<template>
  <div
    ref="root"
    class="smy-swipe"
    :style="touchStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div v-if="$slots.left" ref="leftRef" :class="bem('left')">
      <slot name="left" />
    </div>
    <div :class="bem('content')">
      <slot name="default" />
    </div>
    <div v-if="$slots.right" ref="rightRef" :class="bem('right')">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { props } from './props'
import { useTouch } from '../_utils/composable/useTouch'
import { range } from '../_utils/shared'
import { Ref, computed, defineComponent, ref, unref } from 'vue'
import { createNamespace } from '../_utils/vue/create'
import { getRect } from '../_utils/dom'
import { useClickAway } from '../composables/useClickAway'

type Position = 'left' | 'right' | 'outside'

const [name, bem] = createNamespace('swipe')
const getRefWidth = (ref: Ref<HTMLElement | undefined>) => getRect(unref(ref)).width
const THRESHOLD = 0.15

export default defineComponent({
  name,
  props,
  emits: ['close', 'open'],
  setup(props, { emit, expose }) {
    let opened = false
    let startOffset = 0
    const root = ref<HTMLElement>()
    const offset = ref(0)
    const touching = ref(false)
    const rightRef = ref<HTMLElement>()
    const leftRef = ref<HTMLElement>()

    const { start, move, isHorizontal, state } = useTouch()

    const touchStyle = computed(() => ({
      transform: `translate3d(${offset.value}px, 0, 0)`,
      transitionDuration: touching.value ? '0s' : '.6s',
    }))
    const rightRefWidth = computed(() => getRefWidth(rightRef))
    const leftRefWidth = computed(() => getRefWidth(leftRef))

    function open(position: Position) {
      opened = true
      offset.value = position === 'left' ? -rightRefWidth.value : leftRefWidth.value
      emit('open', { position })
    }
    function close(position: Position) {
      offset.value = 0
      opened = false
      emit('close', { position })
    }

    expose({ open, close })

    useClickAway(root, () => close('outside'), { eventName: 'touchstart' })

    return {
      root,
      rightRef,
      leftRef,
      touchStyle,
      bem,
      onTouchStart(event: TouchEvent) {
        startOffset = offset.value
        start(event)
      },
      onTouchMove(event: TouchEvent) {
        if (props.disabled) return
        move(event)
        if (isHorizontal()) {
          touching.value = true
          offset.value = range(state.deltaX + startOffset, -rightRefWidth.value, leftRefWidth.value)
        }
      },
      onTouchEnd() {
        if (!touching.value) return
        touching.value = false
        const isRight = state.deltaX > 0
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
