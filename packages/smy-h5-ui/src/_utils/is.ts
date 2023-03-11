export declare interface Func<T = any, R = T> {
  (...args: T[]): R
}

export const isType = <T>(val: unknown, type: string): val is T =>
  Object.prototype.toString.call(val) === `[object ${type}]`

export const isNill = (val: unknown): val is null | undefined => val == null

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isNumber = (val: unknown): val is number => typeof val === 'number'

export const isFunction = (val: unknown): val is Func => typeof val === 'function'

export const isPlainObject = (val: unknown) => isType<Record<string, any>>(val, 'Object')

export const isObject = (val: unknown): val is object => typeof val === 'object' && val !== null

export const isArray = Array.isArray

export const isRem = (str: string): boolean => isString(str) && str.endsWith('rem')

export const isPx = (str: string): boolean => isString(str) && str.endsWith('px')

export const isVh = (str: string): boolean => isString(str) && str.endsWith('px')

export const isVw = (str: string): boolean => isString(str) && str.endsWith('px')

export const isNumString = (str: unknown): boolean => isString(str) && /^\d+$/.test(str)
