import { toNumber } from '../_utils/shared'
import { cancelAnimationFrame, requestAnimationFrame } from '../_utils/dom'
import { readonly, ref } from 'vue'

interface UseCountdownOptions {
  onChange?: (pauseTime: number) => void
  onEnd?: () => void
}

export function useCountdown(opts: UseCountdownOptions) {
  const { onChange, onEnd } = opts
  let realEndTime = 0
  let timer: number | null = null
  const started = ref(false)
  const remaining = ref(0)

  function countdown(time: string | number) {
    const now = Date.now()

    if (!realEndTime) realEndTime = now + toNumber(time)
    remaining.value = Math.max(0, realEndTime - now)
    onChange?.(remaining.value)
    if (remaining.value === 0) {
      return onEnd?.()
    }
    if (started.value) timer = requestAnimationFrame(countdown)
  }

  function start(time: string | number) {
    if (started.value) return
    started.value = true
    realEndTime = Date.now() + (remaining.value || toNumber(time))
    countdown(time)
  }

  function pause() {
    started.value = false
  }

  function reset(time: string | number) {
    realEndTime = 0
    started.value = false
    timer && cancelAnimationFrame(timer)
    countdown(time)
  }

  return Object.freeze({
    start,
    pause,
    reset,
    started: readonly(started),
    remaining: readonly(remaining),
  })
}
