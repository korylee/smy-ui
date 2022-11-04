export declare interface Func<T = any, R = T> {
  (...args: T[]): R
}

export const isType =
  <T>(type: string) =>
  (val: unknown): val is T =>
    Object.prototype.toString.call(val) === `[object ${type}]`

export const isNill = (val: unknown): val is null | undefined => val == null

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isFunction = (val: unknown): val is Func => typeof val === 'function'

export const isPlainObject = isType<Record<string, any>>('Object')

export const isObject = (val: unknown): val is object => typeof val === 'object' && val !== null

export const isArray = Array.isArray
