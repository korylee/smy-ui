<template>
  <div ref="scroller" :class="bem()" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div :class="bem('control')" :style="style">
      <slot name="header" v-bind="state">
        <div :class="bem('header')" :style="headerStyle">
          <slot :name="state.status">
            <smy-progress-circular
              v-if="state.status === LOADING"
              :class="bem('header-icon')"
              indeterminate
              width="1.4"
            />
            <div v-if="NORMAL !== state.status" :class="bem('header-text')">{{ getStatusText() }}</div>
          </slot>
        </div>
      </slot>
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { useTouch } from '../_utils/composable/useTouch'
import { toPxNum, convertToUnit, getScrollTop } from '../_utils/dom'
import { props, DEFAULT_HEAD_HEIGHT } from './props'
import SmyProgressCircular from '../progress-circular'
import { computed, defineComponent, nextTick, reactive, ref, watch } from 'vue'
import { createNamespace } from '../_utils/vue/create'
import { useScrollParent } from '../composables/useScrollParent'

const LOADING = 'loading'
const SUCCESS = 'success'
const NORMAL = 'normal'
const PULLING = 'pulling'
const LOOSING = 'loosing'

type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling'

const [name, bem] = createNamespace('pull-refresh')

export default defineComponent({
  name,
  components: { SmyProgressCircular },
  props,
  emits: ['refresh', 'change', 'update:modelValue'],
  setup(props, { emit }) {
    let isReachTop: boolean
    const scroller = ref<HTMLElement>()
    const scrollParent = useScrollParent(scroller)
    const touch = useTouch()
    const state = reactive<{
      status: PullRefreshStatus
      distance: number
      duration: number
    }>({
      status: NORMAL,
      distance: 0,
      duration: 0,
    })
    const headerStyle = computed(() => {
      if (props.headerHeight === DEFAULT_HEAD_HEIGHT) {
        return
      }
      const height = convertToUnit(props.headerHeight)
      return { height }
    })
    const style = computed(() => {
      const { distance, duration } = state
      return {
        transitionDuration: convertToUnit(duration, 'ms'),
        transform: distance ? `translate3d(0, ${distance}px, 0)` : '',
      }
    })
    const getStatusText = () => {
      const { status } = state
      if (status === NORMAL) {
        return
      }
      return props[`${status}Text`]
    }
    const isTouchable = () => ![LOADING, SUCCESS].includes(state.status) && !props.disabled
    // const touchable = computed(() => ![LOADING, SUCCESS].includes(state.status) && !props.disabled)

    const getIsReachTop = () => {
      if (!scrollParent.value) return false
      return getScrollTop(scrollParent.value) === 0
    }
    const getPullDistance = () => toPxNum(props.pullDistance || props.headerHeight)
    const ease = (distance: number) => {
      const pullDistance = getPullDistance()
      if (distance > pullDistance) {
        if (distance < pullDistance * 2) {
          distance = (distance + pullDistance) / 2
        } else {
          distance = pullDistance + distance / 4
        }
      }
      return Math.round(distance)
    }
    const setStatus = (distance: number, isLoading?: boolean) => {
      const pullDistance = getPullDistance()
      state.distance = distance
      const status = isLoading ? LOADING : distance === 0 ? NORMAL : distance < pullDistance ? PULLING : LOOSING
      state.status = status
      emit('change', { status, distance })
    }
    const checkPosition = (event: TouchEvent) => {
      isReachTop = getIsReachTop()
      if (isReachTop) {
        state.duration = 0
        touch.start(event)
      }
    }
    const onTouchStart = (event: TouchEvent) => {
      if (!isTouchable()) return
      checkPosition(event)
    }
    const onTouchMove = (event: TouchEvent) => {
      if (!isTouchable()) return
      if (!isReachTop) {
        checkPosition(event)
      }
      const {
        move,
        isVertical,
        state: { deltaY },
      } = touch
      move(event)
      if (isVertical() && deltaY >= 0 && isReachTop) {
        event.preventDefault()
        setStatus(ease(deltaY))
      }
    }
    const onTouchEnd = () => {
      if (!isReachTop || !isTouchable() || !touch.state.deltaY) return
      state.duration = +props.duration
      if (state.status === LOOSING) {
        setStatus(toPxNum(props.headerHeight), true)
        emit('update:modelValue', true)

        nextTick(() => emit('refresh'))
      } else {
        setStatus(0)
      }
    }

    watch(
      () => props.modelValue,
      (value) => {
        state.duration = +props.duration
        value ? setStatus(toPxNum(props.headerHeight), true) : setStatus(0, false)
      }
    )
    return {
      scroller,
      headerStyle,
      style,
      state,
      bem,
      getStatusText,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      LOADING,
      NORMAL,
    }
  },
})
</script>

<style lang="less">
@import '../progress-circular/progressCircular.less';
@import './pullRefresh.less';
</style>
