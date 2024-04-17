export type Func<T = any, R = T> = (...args: T[]) => R

export type MaybeArray<T> = T | T[]

export type Numeric = number | string

export const isWindow = (val: unknown): val is Window => val === window

const createIsType =
  <T>(type: string) =>
  (val: unknown): val is T =>
    Object.prototype.toString.call(val) === `[object ${type}]`

export const isType = <T>(type: string, val: unknown): val is T => createIsType<T>(type)(val)

export const isNil = (val: unknown): val is null | undefined => val == null

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isFunction = (val: unknown): val is Func => typeof val === 'function'

export const isPlainObject = createIsType<Record<string, any>>('Object')

export const isRegExp = createIsType<RegExp>('RegExp')

export const isDate = (val: unknown): val is Date => createIsType<Date>('Date')(val) && !Number.isNaN(val.getTime())

export const isObject = (val: unknown): val is object => typeof val === 'object' && val !== null

export const isArray: <T = any>(val: unknown) => val is T[] = Array.isArray

const isEndsWith = (str: string, affix: string): boolean => isString(str) && str.endsWith(affix)

export const isRem = (str: string): boolean => isEndsWith(str, 'rem')

export const isPx = (str: string): boolean => isEndsWith(str, 'px')

export const isVh = (str: string): boolean => isEndsWith(str, 'vh')

export const isVw = (str: string): boolean => isEndsWith(str, 'vw')

export const isPercentage = (str: string): boolean => isEndsWith(str, '%')

export const isNumString = (str: unknown): boolean => isString(str) && /^\d+(\.\d+)?$/.test(str)

export const isNumeric = (val: unknown): val is Numeric => isNumber(val) || isNumString(val)

export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isPlainObject(val) && isFunction(val.then) && isFunction(val.catch)

export const isInteger = (num: number) => Math.floor(num) === num
