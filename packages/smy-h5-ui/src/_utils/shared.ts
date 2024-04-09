import { isNil, isString, isObject, isFunction } from '@smy-h5/shared'

export function createLRUCache<T, R>(max: number, cache: Map<T, R> = new Map()) {
  const has = (key: T) => cache.has(key)
  const deleteItem = (key: T) => cache.delete(key)
  const get = (key: T) => {
    if (!has(key)) return undefined
    const temp = cache.get(key)
    if (!temp) return undefined
    cache.delete(key)
    cache.set(key, temp)
    return temp
  }
  const put = (key: T, value: R) => {
    if (has(key)) cache.delete(key)
    else if (cache.size >= max) {
      cache.delete(cache.keys().next().value)
    }
    cache.set(key, value)
  }
  return {
    cache,
    has,
    get,
    put,
    delete: deleteItem,
  }
}

function getObjectValueByPath(obj: any, path: string, fallback?: any) {
  if (isNil(obj) || !path || !isString(path)) return fallback
  return obj[path]
}

export function createGetPropertyFromItem<R, T>(property: string | ((item: R, ...args: T[]) => any), fallback?: any) {
  return function (item: R, ...args: T[]) {
    if (isNil(property)) return item ?? fallback
    if (isFunction(property)) return property(item, ...args) ?? fallback
    if (!isObject(item)) return isNil(fallback) ? item : fallback
    if (isString(property)) return getObjectValueByPath(item, property, fallback)
    return item ?? fallback
  }
}

/**
function genFillerString(str: string, maxlength: number, fillString: string) {
  const stringLength = str.length
  if (maxlength <= stringLength) {
    return ''
  }
  let filler = fillString
  if (filler === '') return ''
  const fillLen = maxlength - stringLength
  while (filler.length < fillLen) {
    const fLen = filler.length
    const remainingCodeUnits = fillLen - fLen
    filler += fLen > remainingCodeUnits ? filler.slice(0, remainingCodeUnits) : filler
  }
  return filler.slice(0, fillLen)
}

const StringPrototype = String.prototype

if (!StringPrototype.padEnd) {
  StringPrototype.padEnd = function padEnd(maxlength: number, fillString = ' ') {
    const str = String(this)
    const filler = genFillerString(str, maxlength, fillString)
    return str + filler
  }
  StringPrototype.padStart = function padStart(maxlength: number, fillString = ' ') {
    const str = String(this)
    const filler = genFillerString(str, maxlength, fillString)
    return filler + str
  }
}
 */

export const isSameValue = (newValue: unknown, oldValue: unknown) =>
  JSON.stringify(newValue) === JSON.stringify(oldValue)

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
