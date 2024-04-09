import { isBool, isNil, isString } from './is'

export function toNumber(val: number | string | boolean | undefined | null, defaultValue = 0): number {
  if (isNil(val)) return defaultValue
  if (isBool(val)) return Number(val)
  if (isString(val)) {
    val = parseFloat(val)
    return Number.isNaN(val) ? defaultValue : val
  }
  return val
}

export function formatNumber(value: string, allowDot = true, allowMinus = true) {
  const minusIndex = value.indexOf('-')
  const minusSymbol = allowMinus && minusIndex === 0 ? '-' : ''
  value = minusSymbol + value.replace(/-/g, '')

  const dotIndex = value.indexOf('.')
  if (dotIndex > -1) {
    const affix = allowDot ? '.' + value.slice(dotIndex).replace(/\./g, '') : ''
    value = value.slice(0, dotIndex) + affix
  }
  value = value.replace(/[^-0-9.]/g, '')
  return value
}

function getDecimalLength(num: number) {
  const decimal = String(num).split('.')[1]
  return decimal ? decimal.length : 0
}

export const decimal = (() => {
  const pow = (num: number) => Math.pow(10, num)

  function getMaxMultiple(a: number, b: number) {
    const precision = Math.max(getDecimalLength(a), getDecimalLength(b))
    return pow(precision)
  }
  function add(a: number, b: number) {
    const multiple = getMaxMultiple(a, b)
    return (a * multiple + b * multiple) / multiple
  }
  function subtract(a: number, b: number) {
    const multiple = getMaxMultiple(a, b)
    return (a * multiple - b * multiple) / multiple
  }
  function multiply(a: number, b: number) {
    const multiple = getMaxMultiple(a, b)
    return (a * multiple * b) / multiple
  }
  function divide(a: number, b: number) {
    const multiple = getMaxMultiple(a, b)
    return (a * multiple) / (b * multiple)
  }
  return {
    add,
    subtract,
    multiply,
    divide,
  }
})()

export const range = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
