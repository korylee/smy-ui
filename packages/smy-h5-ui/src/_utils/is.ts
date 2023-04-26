export declare interface Func<T = any, R = T> {
  (...args: T[]): R
}

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

export const isDate = createIsType<Date>('Date')

export const isObject = (val: unknown): val is object => typeof val === 'object' && val !== null

export const isArray = Array.isArray

export const isRem = (str: string): boolean => isString(str) && str.endsWith('rem')

export const isPx = (str: string): boolean => isString(str) && str.endsWith('px')

export const isVh = (str: string): boolean => isString(str) && str.endsWith('vh')

export const isVw = (str: string): boolean => isString(str) && str.endsWith('vw')

export const isNumString = (str: unknown): boolean => isString(str) && /^\d+$/.test(str)
