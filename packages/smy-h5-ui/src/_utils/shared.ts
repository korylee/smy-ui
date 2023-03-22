import { isBool, isNill, isString, isArray, type Func, isObject } from './is'
import { warn } from './smy/warn'

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

export function throttle<T extends Func>(method: T, mustRunDelay = 200): T {
  let timer: number
  let start = 0
  return function loop(this: unknown, ...args: any[]) {
    const now = Date.now()
    const elapsed = now - start

    if (!start) start = now
    if (timer) {
      window.clearTimeout(timer)
    }
    if (elapsed >= mustRunDelay) {
      method.apply(this, args)
      start = now
    } else {
      timer = window.setTimeout(() => {
        loop.apply(this, args)
      }, mustRunDelay - elapsed)
    }
  } as T
}

export function merge(target: any, ...args: any[]) {
  args.forEach((source = {}) => {
    Reflect.ownKeys(source).forEach((prop) => {
      const value = source[prop]
      if (value == undefined) return
      target[prop] = value
    })
  })
  return target
}

export interface LRUCacheInstance<T, R> {
  cache: Map<T, R>
  has(key: T): boolean
  put(key: T, value: R): void
  get(key: T): R | undefined
  delete(key: T): boolean
}

export function createLRUCache<T, R>(max: number, cache = new Map()): LRUCacheInstance<T, R> {
  const has = (key: T) => cache.has(key)
  const deleteItem = (key: T) => cache.delete(key)
  const get = (key: T) => {
    if (!has(key)) return undefined
    const temp = cache.get(key)
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

export function getDate(time?: string | number) {
  if (!time) return
  let t = time
  t = t > 0 ? +t : t.toString().replace(/-/g, '/')
  const date = new Date(t)
  if (date.toString() === 'Invalid Date') {
    warn('getDate', `${time} is invalid date`)
    return
  }
  return date
}
