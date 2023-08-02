<template>
  <div :class="bem()">
    <slot v-bind="timeData"> {{ parseTime(format, timeData) }}</slot>
  </div>
</template>

<script>
import { ref, watch, onBeforeUnmount, defineComponent, onMounted } from 'vue'
import { props } from './props'
import { parseTime, formatTime } from './utils'
import { createNamespace } from '../_utils/vue/create'
import { useCountdown } from '../composables/useCountdown'

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
      pause: _pause,
      started,
      remaining,
    } = useCountdown({
      onChange: (time) => {
        const formatedTimeData = formatTime(time)
        timeData.value = formatedTimeData
        emit('change', formatedTimeData)
      },
      onEnd: () => {
        emit('end')
      },
    })
    const reset = () => _reset(props.time)
    const start = () => {
      if (started.value) return
      _start(props.time)
      emit('start', props.time)
      emit('update:paused', false)
    }
    const pause = () => {
      emit('pause', remaining.value)
      emit('update:paused', true)
      _pause()
    }

    expose({
      start,
      reset,
      pause,
    })
    watch(() => props.time, reset)
    watch(
      () => props.paused,
      (val, oldVal) => {
        if (!oldVal && started.value) pause()
        else if (oldVal && !started.value) start()
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
