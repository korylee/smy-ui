declare interface Func<T = any, R = T> {
  (...args: T[]): R
}

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

export function throttle<T = Func>(method: T, mustRunDelay = 200): T {
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
  }
}

export const isNill = (val: unknown): val is null | undefined => val == null

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const doubleRaf = () =>
  new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve)
    })
  })

export function merge(target, ...args) {
  args.forEach((source = {}) => {
    Reflect.ownKeys(source).forEach((prop) => {
      const value = source[prop]
      if (value == undefined) return
      target[prop] = value
    })
  })
  return target
}

/**
 * 检查当前dom是否在视口，getBoundingClientRect这方案终究还是有性能问题，后续看有无必要换方案
 */
export async function inViewport(el: HTMLElement): Promise<boolean> {
  await doubleRaf()
  const { top, bottom, left, right } = el.getBoundingClientRect()
  const { innerWidth, innerHeight } = window
  const xInViewport = left <= innerWidth && right >= 0
  const yInViewport = top <= innerHeight && bottom >= 0

  return xInViewport && yInViewport
}

export interface LRUCacheInstance<T, R> {
  cache: Map<T, R>
  has(key: T): boolean
  put(key: T, value: R): void
  get(key: T): R | undefined
  delete(key: T): boolean
}

export function getParentScroller(el: HTMLElement): HTMLElement | Window {
  let element = el
  while (element) {
    if (!element.parentNode) break
    element = element.parentNode as HTMLElement
    if (element === document.body || element === document.documentElement) {
      break
    }
    const scrollRE = /(scroll|auto)/
    const { overflowY, overflow } = window.getComputedStyle(element)
    if (scrollRE.test(overflowY) || scrollRE.test(overflow)) {
      return element
    }
  }
  return window
}

export function getAllParentScroller(el: HTMLElement): Array<HTMLElement | Window> {
  const allParentScroller: Array<HTMLElement | Window> = []
  let element: HTMLElement | Window = el
  while (element !== window) {
    element = getParentScroller(element)
    allParentScroller.push(element)
  }
  return allParentScroller
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
