import { isBool, isNill, isString } from './is'

export function toNumber(val) {
  if (isNill(val)) return 0
  if (isBool(val)) return Number(val)
  if (isString(val)) {
    val = parseFloat(val)
    val = Number.isNaN(val) ? 0 : val
    return val
  }
  return val
}
