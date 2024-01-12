import { createNamespace } from '../_utils/vue/create'
import { props } from './props'
import { parseTime, useCountdown, formatTime } from './utils'

const [name, bem] = createNamespace('countdown')

export default {
  name,
  props,

  data: (vm) => ({
    remainTime: 0,
    countdown: useCountdown({
      onChange: (time) => {
        const timeData = formatTime(time)
        vm.remainTime = time
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

  computed: {
    timeData({ remainTime }) {
      return formatTime(remainTime)
    },
  },
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
      this.countdown.start()
    },
    pause() {
      this.countdown.pause()
    },
    reset() {
      const { autoStart, paused, start, countdown, time } = this
      const reset = () => countdown.reset(time)
      this.remainTime = time
      reset()
      if (autoStart && !paused) {
        start()
      }
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
