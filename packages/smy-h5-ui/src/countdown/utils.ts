import { padZero, toNumber } from '../_utils/shared'
import { cancelAnimationFrame, requestAnimationFrame } from '../_utils/dom'
import { IN_BROWSER } from '../_utils/env'

export type TimeData = ReturnType<typeof formatTime>

export function parseTime(format: string, time: TimeData): string {
  const { days, hours, minutes, seconds, milliseconds } = time
  const scannedTimes = [days, hours, minutes, seconds, milliseconds]
  const scannedFormats = ['DD', 'HH', 'mm', 'ss']
  const padValues = [24, 60, 60, 1000]

  scannedFormats.forEach((scannedFormat, index) => {
    if (!format.includes(scannedFormat)) {
      scannedTimes[index + 1] += scannedTimes[index] * padValues[index]
    } else {
      format = format.replace(scannedFormat, padZero(scannedTimes[index], 2))
    }
  })

  const msReg = /S+/
  const msMatch = format.match(msReg)

  if (msMatch?.length) {
    const ms = padZero(scannedTimes[scannedTimes.length - 1], 3)
    format = format.replace(msReg, ms.slice(0, msMatch[0].length))
  }
  return format
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

interface UseCountdownOptions {
  onChange?: (pauseTime: number) => void
  onStart?: (pauseTime: number) => void
  onEnd?: () => void
  onPause?: (pauseTime: number) => void
  millisecond?: boolean
}

export function formatTime(durationTime: number) {
  const days = Math.floor(durationTime / DAY)
  const hours = Math.floor((durationTime % DAY) / HOUR)
  const minutes = Math.floor((durationTime % HOUR) / MINUTE)
  const seconds = Math.floor((durationTime % MINUTE) / SECOND)
  const milliseconds = Math.floor(durationTime % SECOND)

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    total: durationTime,
  }
}

function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}

export function useCountdown(opts: UseCountdownOptions) {
  const { onChange, onEnd, onStart, onPause, millisecond } = opts
  let endTime = 0
  let remainTime = 0
  let timer: number | null = null
  let isStart = false

  function setRemain(value: number) {
    remainTime = value
    onChange?.(remainTime)
    if (value === 0) {
      isStart = false
      return onEnd?.()
    }
  }
  function countdown() {
    if (!IN_BROWSER) return

    const now = performance.now()

    if (!endTime) endTime = now + remainTime
    if (isStart) {
      const currentRemain = Math.max(endTime - now, 0)
      if (millisecond) {
        setRemain(currentRemain)
      } else if (!isSameSecond(remainTime, currentRemain) || currentRemain === 0) {
        setRemain(currentRemain)
      }
      if (currentRemain >= 0) {
        timer = requestAnimationFrame(countdown)
      }
    }
  }

  function start() {
    if (isStart) return

    isStart = true
    endTime = 0
    onStart?.(remainTime)
    countdown()
  }

  function pause() {
    onPause?.(remainTime)
    isStart = false
    timer && cancelAnimationFrame(timer)
  }

  function reset(time: string | number) {
    endTime = 0
    isStart = false
    remainTime = toNumber(time)
    timer && cancelAnimationFrame(timer)
    countdown()
  }

  return Object.freeze({
    start,
    pause,
    reset,
    isStart: () => isStart,
  })
}
