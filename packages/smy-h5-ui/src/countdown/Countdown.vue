<template>
  <div :class="bem()">
    <slot v-bind="timeData"> {{ parseTime(format, timeData) }}</slot>
  </div>
</template>

<script>
import { ref, watch, onBeforeUnmount, defineComponent, onMounted } from 'vue'
import { props } from './props'
import { parseTime, useCountdown, formatTime } from './utils'
import { createNamespace } from '../_utils/vue/create'

const [name, bem] = createNamespace('countdown')

export default defineComponent({
  name,
  props,
  emits: ['change', 'end', 'start', 'pause', 'update:paused'],
  setup(props, { emit, expose }) {
    const timeData = ref({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      timestamp: 0,
      time: 0,
    })
    const {
      reset: _reset,
      start: _start,
      pause,
      isStart,
    } = useCountdown({
      onChange: (time) => {
        const formatedTimeData = formatTime(time)
        timeData.value = formatedTimeData
        emit('change', formatedTimeData)
      },
      onStart: (time) => {
        emit('start', time)
        emit('update:paused', false)
      },
      onEnd: () => {
        emit('end')
      },
      onPause: (time) => {
        emit('pause', time)
        emit('update:paused', true)
      },
    })
    const reset = () => _reset(props.time)
    const start = () => _start(props.time)

    expose({
      start,
      reset,
      pause,
    })
    watch(() => props.time, reset)
    watch(
      () => props.paused,
      (val, oldVal) => {
        const started = isStart()
        if (!oldVal && started) pause()
        else if (oldVal && !started) start()
      }
    )
    onMounted(props.autoStart && !props.paused ? start : reset)
    onBeforeUnmount(pause)

    return {
      timeData,
      bem,
      parseTime,
    }
  },
})
</script>
