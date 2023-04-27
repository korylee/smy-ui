import { isBool, isNil, isString, isArray, type Func, isObject, isRegExp, isDate } from './is'

const cameLizeRE = /-(\w)/g

export function camelize(str: string) {
  return str.replace(cameLizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}
export function kebabCase(str: string): string {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export const upperFirst = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

export function toNumber(val: number | string | boolean | undefined | null): number {
  if (isNil(val)) return 0
  if (isBool(val)) return Number(val)
  if (isString(val)) {
    val = parseFloat(val)
    return Number.isNaN(val) ? 0 : val
  }
  return val
}

export const range = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

export const removeItem = (arr: Array<unknown>, item: unknown) => {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index !== -1) return arr.splice(index, 1)
}

export function throttle<T extends Func>(fn: T, delay = 200): T {
  let timer: NodeJS.Timeout | undefined
  let start = 0
  return function loop(this: unknown, ...args: any[]) {
    const now = Date.now()
    const elapsed = now - start
    const timeout = delay - elapsed

    if (!timer && timeout <= 0) {
      fn.apply(this, args)
      start = now
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = undefined
        start = Date.now()
      }, timeout)
    }
  } as T
}

type AnyObject = Record<string, any>

type AssignCustomizer = (
  targetValue: any,
  sourceValue: any,
  key?: string,
  target?: AnyObject,
  source?: AnyObject
) => any

const ObjectProto = Object.prototype
const hasOwnProperty = ObjectProto.hasOwnProperty
const isMergeableObject = (val: unknown) => isObject(val) && !isRegExp(val) && !isDate(val)

export function assignWith<T extends AnyObject, U extends AnyObject>(
  target: T,
  source: U,
  customizer: AssignCustomizer
) {
  for (const key in source) {
    if (hasOwnProperty.call(source, key)) {
      ;(target[key] as any) = customizer(target[key], source[key], key, target, source)
    }
  }

  return target as T & U
}

export function assign<T, U>(object: T, source: U): T & U
export function assign<T, U, R>(object: T, source1: U, source2: R): T & U & R
export function assign<T extends AnyObject>(target: T, ...sources: any[]): any {
  return sources.reduce((acc, cur) => (isMergeableObject(cur) ? assignWith(acc, cur, (t, s) => s) : acc), target)
}

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

export function pick<T extends Record<string, any>, R extends keyof T>(source: T, props: R | R[]): Pick<T, R> {
  if (!isObject(source)) return {} as any
  const wrapProps = isNil(props) ? [] : isArray(props) ? props : [props]
  return wrapProps.reduce((res, key: R) => {
    const exist = Reflect.has(source, key)
    if (exist) {
      Reflect.set(res, key, source[key])
    }
    return res
  }, {} as Pick<T, R>)
}

export const keys: <O extends Record<string, any>>(obj: O) => (keyof O)[] = Object.keys
