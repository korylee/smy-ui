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
      format = format.replace(scannedFormat, String(scannedTimes[index]).padStart(2, '0'))
    }
  })

  const msReg = /S+/
  const msMatch = format.match(msReg)

  if (msMatch?.length) {
    const ms = String(scannedTimes[scannedTimes.length - 1]).padStart(3, '0')
    format = format.replace(msReg, ms.slice(0, msMatch[0].length))
  }
  return format
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

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
