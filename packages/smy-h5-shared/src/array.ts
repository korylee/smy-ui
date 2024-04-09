import { isArray, isNil } from './is'

export function wrapInArray<T>(v: T | T[] | null | undefined): T[] {
  return isNil(v) ? [] : isArray(v) ? v : [v]
}

export const removeItem = (arr: Array<unknown>, item: unknown) => {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index !== -1) return arr.splice(index, 1)
}
