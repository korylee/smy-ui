import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import { parseTime, useCountdown, formatTime } from './utils'

const [name, bem] = createNamespace('countdown')

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
      millisecond: vm.milliseconds || /S+/.test(vm.format),
    }),
  }),

  watch: {
    time: { immediate: true, handler: 'reset' },
    paused(val, oldVal) {
      const { countdown } = this
      const isStart = countdown.isStart()
      if (!oldVal && isStart) this.pause()
      else if (oldVal && !isStart) this.start()
    },
  },

  beforeDestroy() {
    this.pause()
  },

  methods: {
    start() {
      this.countdown.start(this.time)
    },
    pause() {
      this.countdown.pause()
    },
    reset() {
      const { autoStart, paused, start, countdown, time } = this
      const reset = () => countdown.reset(time)
      const run = autoStart && !paused ? start : reset
      run()
    },
  },
  render() {
    const _vm = this
    const _h = _vm.$createElement
    const _c = _vm._self._c || _h
    const { timeData } = _vm

    return _c(
      'div',
      { staticClass: bem(), role: 'timer' },
      [_vm._t('default', () => [parseTime(_vm.format, timeData)], timeData)],
      2,
    )
  },
}
