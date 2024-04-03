import { Numeric, isNumeric } from '@smy-h5/shared'

export function normalizeBadge(value: Numeric, max: Numeric) {
  if (!value) return
  if (isNumeric(value) && isNumeric(max)) {
    return +max < +value ? `${max}+` : value
  }
  return value
}
