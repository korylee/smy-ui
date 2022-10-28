export type TimeData = {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export function parseTime(format: string, time: TimeData): string {
  const scannedTimes = Object.values(time)
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
