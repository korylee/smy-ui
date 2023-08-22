<template>
  <div class="smy-countdown">
    <slot v-bind="timeData"> {{ parseTime(format, timeData) }}</slot>
  </div>
</template>

<script>
import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import { parseTime, useCountdown, formatTime } from './utils'

const [name] = createNamespace('countdown')

export default {
  name,
  props,

  data: (vm) => ({
    timeData: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      total: 0,
    },
    countdown: useCountdown({
      onChange: (time) => {
        const timeData = formatTime(time)
        vm.timeData = timeData
        vm.$emit('change', timeData)
      },
      onStart: (time) => {
        vm.$emit('start', time)
        vm.$emit('update:paused', false)
      },
      onEnd: () => {
        vm.$emit('end')
      },
      onPause: (time) => {
        vm.$emit('pause', time)
        vm.$emit('update:paused', true)
      },
    }),
  }),

  watch: {
    time: 'reset',
    paused(val, oldVal) {
      const { countdown } = this
      const isStart = countdown.isStart()
      if (!oldVal && isStart) this.pause()
      else if (oldVal && !isStart) this.start()
    },
  },

  created() {
    const { autoStart, paused, start, reset } = this
    const run = autoStart && !paused ? start : reset
    run()
  },

  beforeDestroy() {
    this.pause()
  },

  methods: {
    parseTime,
    start() {
      this.countdown.start(this.time)
    },
    pause() {
      this.countdown.pause()
    },
    reset() {
      this.countdown.reset(this.time)
    },
  },
}
</script>
