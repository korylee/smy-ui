import { isBool, isNil, isString, isArray, type Func, isObject, isRegExp, isDate, isFunction, isInteger } from './is'

const cameLizeRE = /-(\w)/g

export function camelize(str: string) {
  return str.replace(cameLizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}
export function kebabCase(str: string): string {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export const upperFirst = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

export function toNumber(val: number | string | boolean | undefined | null, defaultValue = 0): number {
  if (isNil(val)) return defaultValue
  if (isBool(val)) return Number(val)
  if (isString(val)) {
    val = parseFloat(val)
    return Number.isNaN(val) ? defaultValue : val
  }
  return val
}

export function formatNumber(value: string, allowDot = true, allowMinus = true) {
  const minusIndex = value.indexOf('-')
  const minusSymbol = allowMinus && minusIndex === 0 ? '-' : ''
  value = minusSymbol + value.replace(/-/g, '')

  const dotIndex = value.indexOf('.')
  if (dotIndex > -1) {
    const affix = allowDot ? '.' + value.slice(dotIndex).replace(/\./g, '') : ''
    value = value.slice(0, dotIndex) + affix
  }
  value = value.replace(/[^-0-9.]/g, '')
  return value
}

export const decimal = (() => {
  /**
   * 将一个浮点数转化为整数，返回整数和倍数
   */
  function toInteger(num: number) {
    const ret = { num: 0, multiple: 0 }
    if (isInteger(num)) {
      ret.num = num
      return ret
    }
    const strNum = num + ''
    const dotPos = strNum.indexOf('.')
    const len = strNum.substring(dotPos + 1).length
    ret.multiple = len
    ret.num = Number(strNum.replace('.', ''))
    return ret
  }
  const pow = (num: number) => Math.pow(10, num)
  function operationFactory(operate: 'add' | 'subtract') {
    return function (a: number, b: number) {
      const { num: numA, multiple: mulA } = toInteger(a)
      const { num: numB, multiple: mulB } = toInteger(b)

      switch (operate) {
        case 'add':
        case 'subtract': {
          const [tempA, tempB, max] = mulA > mulB ? [1, pow(mulA - mulB), pow(mulA)] : [pow(mulB - mulA), 1, pow(mulB)]
          const diff = operate === 'add' ? 1 : -1

          return (numA * tempA + numB * tempB * diff) / max
        }
      }
    }
  }
  return {
    add: operationFactory('add'),
    subtract: operationFactory('subtract'),
  }
})()

export const addNumber = decimal.add

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
export function assign<T, U, R, P>(object: T, source1: U, source2: R, source3: P): T & U & R & P
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

export function pick<T extends Record<string, any>, R extends keyof T>(
  source: T,
  props: R | R[] | Readonly<R>[]
): Pick<T, R> {
  if (!isObject(source)) return {} as any
  const wrapProps = wrapInArray(props)
  return wrapProps.reduce((res, key: R) => {
    const exist = Reflect.has(source, key)
    if (exist) {
      Reflect.set(res, key, source[key])
    }
    return res
  }, {} as Pick<T, R>)
}

export const keys: <O extends Record<string, any>>(obj: O) => (keyof O)[] = Object.keys

export function wrapInArray<T>(v: T | T[] | null | undefined): T[] {
  return isNil(v) ? [] : isArray(v) ? v : [v]
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

export const padZero = (num: number, targetLength = 2) => (num + '').padStart(targetLength, '0')

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
