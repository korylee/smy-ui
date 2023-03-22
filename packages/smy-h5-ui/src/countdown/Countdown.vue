<template>
  <div class="smy-countdown">
    <slot v-bind="timeData" :timestamp="pauseTime"> {{ parseTime(format, timeData) }}</slot>
  </div>
</template>

<script>
import { cancelAnimationFrame, requestAnimationFrame } from '../_utils/dom'
import { toNumber } from '../_utils/shared'
import { props } from './props'
import { parseTime } from './utils'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export default {
  name: 'SmyCountdown',
  props,

  data: () => ({
    realEndTime: 0,
    isStart: false,
    timer: 0,
    pauseTime: 0, // 倒计时剩余时间
    timeData: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    },
  }),

  watch: {
    time: 'reset',
    paused(val, oldVal) {
      const { isStart } = this
      if (!oldVal && isStart) this.pause()
      else if (oldVal && !isStart) this.start()
    },
  },

  created() {
    if (this.autoStart && !this.paused) this.start()
    else this.reset()
  },

  beforeDestroy() {
    this.pause()
  },

  methods: {
    parseTime,
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
      this.$emit('change', time)
    },
    countdown() {
      const { time, isStart } = this
      const now = Date.now()

      if (!this.realEndTime) this.realEndTime = now + toNumber(time)
      let durationTime = this.realEndTime - now
      if (durationTime < 0) durationTime = 0
      this.pauseTime = durationTime
      this.formatTime(durationTime)
      if (durationTime === 0) {
        return void this.$emit('end')
      }
      if (isStart) this.timer = requestAnimationFrame(this.countdown)
    },
    start() {
      if (this.isStart) return
      this.isStart = true
      this.realEndTime = Date.now() + (this.pauseTime || toNumber(this.time))
      this.$emit('start', this.pauseTime)
      this.$emit('update:paused', false)
      this.countdown()
    },
    pause() {
      this.$emit('pause', this.pauseTime)
      this.$emit('update:paused', true)
      this.isStart = false
    },
    reset() {
      this.realEndTime = 0
      this.isStart = false
      cancelAnimationFrame(this.timer)
      this.countdown()
    },
  },
}
</script>
