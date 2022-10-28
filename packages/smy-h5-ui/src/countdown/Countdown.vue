<template>
  <div class="smy-countdown">
    <slot v-bind="timeData">
      {{ showTime }}
    </slot>
  </div>
</template>

<script>
import { toNumber } from '../_utils/shared'
import { props } from './props'
import { parseTime } from './utils'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export default {
  name: 'SmyCountDown',
  props,

  data: () => ({
    endTime: 0,
    isStart: false,
    showTime: '',
    handle: 0,
    pauseTime: 0,
    timeData: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    },
  }),

  watch: {
    time: {
      immediate: true,
      handler() {
        this.reset()
      },
    },
  },

  methods: {
    formatTime(durationTime) {
      const days = Math.floor(durationTime / DAY)
      const hours = Math.floor((durationTime % DAY) / HOUR)
      const minutes = Math.floor((durationTime % HOUR) / MINUTE)
      const seconds = Math.floor((durationTime % MINUTE) / SECOND)
      const milliseconds = Math.floor(durationTime % SECOND)

      const time = {
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      }
      this.timeData = time
      this.$listeners.change?.(time)
      this.showTime = parseTime(this.format, time)
    },
    countdown() {
      const { time, autoStart, isStart } = this
      const now = Date.now()

      if (!this.endTime) this.endTime = now + toNumber(time)
      let durationTime = this.endTime - now
      if (durationTime < 0) durationTime = 0
      this.pauseTime = durationTime

      this.formatTime(durationTime)
      if (durationTime === 0) {
        this.$emit('end')
        return
      }
      if (autoStart || isStart) this.handle = requestAnimationFrame(this.countdown)
    },
    start() {
      if (this.isStart) return
      this.isStart = true
      this.endTime = Date.now() + (this.pauseTime || toNumber(this.time))
      this.countdown()
    },
    pause() {
      this.isStart = false
    },
    reset() {
      this.endTime = 0
      this.isStart = false
      cancelAnimationFrame(this.handle)
      this.countdown()
    },
  },
}
</script>
