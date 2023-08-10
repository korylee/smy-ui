<template>
  <div class="smy-picker__column" @touchstart="onTouchstart" @touchmove.prevent="onTouchmove" @touchend="onTouchend">
    <div :style="getScrollerStyle()" class="smy-picker__scroller" ref="scroller" @transitionend="onTransitionend">
      <div
        v-for="(option, optionIndex) in column"
        :key="optionIndex"
        :style="{ height: `${height}px` }"
        class="smy-picker__option"
      >
        <slot name="option" :option="option" :index="optionIndex" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue'
import { getTranslate } from '../_utils/dom'
import { range } from '../_utils/shared'
import { createNumberProp } from '../_utils/vue/props'

const MOMENTUM_RECORD_TIME = 300
const MOMENTUM_ALLOW_DISTANCE = 15

function momentum(distance: number, duration: number) {
  return distance / duration / 0.003
}

export default defineComponent({
  name: 'SmyPickerColumn',
  props: {
    height: createNumberProp(0),
    column: { type: Array, default: () => [] },
    columnIndex: createNumberProp(0),
    pickedIndex: createNumberProp(0),
    center: createNumberProp(0),
  },
  emits: ['change', 'update:pickedIndex'],
  setup(props, { emit, expose }) {
    let touching = false
    let prevY: number | undefined
    let momentumPrevY: number
    let momentumTime = 0
    let currentIndex = 0
    let scrolling = false

    const state = reactive({
      translate: props.center,
      duration: 0,
    })
    const scroller = ref()

    const scrollTo = (index: number, duration = 0, noEmit = false) => {
      const { height, center } = props
      const translate = center - index * height
      if (translate === state.translate) {
        scrolling = false
        !noEmit && emit('change')
      } else {
        state.translate = translate
      }
      state.duration = duration
      if (currentIndex === index) return
      currentIndex = index
      emit('update:pickedIndex', index)
    }
    const getIndex = (translate: number) => {
      const { center, height, column } = props
      return range(Math.round((center - translate) / height), 0, column.length - 1)
    }
    const stopScroll = () => {
      if (!scrolling) return
      const index = getIndex(getTranslate(scroller.value))
      scrollTo(index, 0, true)
    }
    const limitTranslate = (translate: number) => {
      const { height, center, column } = props
      const START_LIMIT = height + center
      const END_LIMIT = center - column.length * height

      return range(translate, END_LIMIT, START_LIMIT)
    }
    const onTouchstart = () => {
      touching = true
      scrolling = false
      state.duration = 0
      state.translate = getTranslate(scroller.value)
    }
    const onTouchmove = (event: TouchEvent) => {
      if (!touching) return

      const { clientY } = event.touches[0]
      const moveY = prevY !== undefined ? clientY - prevY : 0
      prevY = clientY

      state.translate = limitTranslate(state.translate + moveY)

      const now = performance.now()
      if (now - momentumTime > MOMENTUM_RECORD_TIME) {
        momentumTime = now
        momentumPrevY = state.translate
      }
    }
    const onTouchend = () => {
      touching = false
      scrolling = true
      prevY = undefined
      const distance = state.translate - momentumPrevY
      const duration = performance.now() - momentumTime
      const shouldMomentum = Math.abs(distance) >= MOMENTUM_ALLOW_DISTANCE && duration <= MOMENTUM_RECORD_TIME
      shouldMomentum && (state.translate += momentum(distance, duration))
      scrollTo(getIndex(state.translate), shouldMomentum ? 1000 : 200)
    }
    const onTransitionend = () => {
      scrolling = false
      state.duration = 0
      emit('change')
    }

    expose({
      stopScroll,
    })

    watch(
      () => props.pickedIndex,
      (value) => {
        if (value === currentIndex) return
        scrollTo(value, 0)
      },
      { immediate: true }
    )
    return {
      scroller,
      getScrollerStyle: () => ({
        transform: `translate3d(0, ${state.translate}px, 0)`,
        transitionDuration: `${state.duration}ms`,
        transitionProperty: state.duration ? 'transform' : 'none',
      }),
      onTouchstart,
      onTouchmove,
      onTouchend,
      onTransitionend,
    }
  },
})
</script>
