import { isBool, isNill, isString, isArray, type Func, isObject, isRegExp, isDate } from './is'

const cameLizeRE = /-(\w)/g

export function camelize(str: string) {
  return str.replace(cameLizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}
export function kebabCase(str: string): string {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export const upperFirst = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

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

export const removeItem = (arr: Array<unknown>, item: unknown) => {
  if (!arr.length) return
  const index: number = arr.indexOf(item)
  if (~index) return arr.splice(index, 1)
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

const isMergeableObject = (val: unknown) => isObject(val) && !isRegExp(val) && !isDate(val)

export function merge<T extends AnyObject>(target: T, ...sources: AnyObject[]): T {
  if (!sources.length) return target
  for (const source of sources) {
    if (!isMergeableObject(source)) {
      continue
    }
    for (const key of Object.keys(source)) {
      const sourceValue = source[key]
      const targetValue = target[key]
      const mergedValue = isMergeableObject(sourceValue)
        ? merge(isMergeableObject(targetValue) ? targetValue : {}, sourceValue)
        : sourceValue
      ;(target[key] as any) = mergedValue
    }
  }
  return target
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = (): void => {}

export function pick<T extends Record<string, any>, R extends keyof T>(source: T, props: R | R[]): Pick<T, R> {
  if (!isObject(source)) return {} as any
  const wrapProps = isNill(props) ? [] : isArray(props) ? props : [props]
  return wrapProps.reduce((res, key: R) => {
    const exist = Reflect.has(source, key)
    if (exist) {
      Reflect.set(res, key, source[key])
    }
    return res
  }, {} as Pick<T, R>)
}
