export function toNumber(val: number | string | boolean | undefined | null): number {
  if (isNill(val)) return 0
  if (isBool(val)) return Number(val)
  if (isString(val)) {
    val = parseFloat(val)
    val = Number.isNaN(val) ? 0 : val
    return val
  }
  return val
}

export const isNill = (val: unknown): val is null | undefined => val == null

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean'

export const isString = (val: unknown): val is string => typeof val === 'string'
