import { inBrowser } from './env'
import { isNumString, isNumber } from './is'

export function requestAnimationFrame(fn) {
  return inBrowser ? globalThis.requestAnimationFrame(fn) : setTimeout(fn, 1000 / 60)
}

export function cancelAnimationFrame(handle) {
  return inBrowser ? globalThis.cancelAnimationFrame(handle) : clearTimeout(handle)
}

export function convertToUnit(str, unit = 'px') {
  if (str == null || str === '') return undefined
  if (isNumber(str) || isNumString(str)) return `${Number(str)}${unit}`
  if (isNaN(+str)) return String(str)
  return `${Number(str)}${unit}`
}
