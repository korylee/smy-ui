import { Numeric, isNumeric } from '../_utils/is'

export function normalizeBadge(value: Numeric, max: Numeric) {
  if (!value) return
  if (isNumeric(value) && isNumeric(max)) {
    return +max < +value ? `${max}+` : value
  }
  return value
}
