import { isArray, isNil } from '../../is'

export function validator(value: any) {
  if (isNil(value) || (isArray(value) && value.length === 0) || value === false) {
    return false
  }

  return !!String(value).trim().length
}
