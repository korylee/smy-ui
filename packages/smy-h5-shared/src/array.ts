import { isArray, isNil } from './is'

export function genArray<T>(length: number, gen: (index: number) => T, filter?: (item: T) => boolean) {
  const res = []
  for (let i = 0; i < length; i++) {
    const item = gen(i)
    if (filter && !filter(item)) {
      continue
    }
    res.push(item)
  }
  return res
}

export function wrapInArray<T>(v: T | T[] | null | undefined): T[] {
  return isNil(v) ? [] : isArray(v) ? v : [v]
}

export const removeItem = (arr: Array<unknown>, item: unknown) => {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index !== -1) return arr.splice(index, 1)
}
