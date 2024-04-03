import { wrapInArray } from './array'
import { isDate, isObject, isRegExp } from './is'

export type RequiredPartial<T, R extends keyof T> = Omit<T, R> &
  Required<{
    [O in R]: T[O]
  }>

export function pick<T extends Record<string, any>, R extends keyof T>(
  source: T,
  props: R | R[] | Readonly<R[]>,
): Pick<T, R> {
  if (!isObject(source)) return {} as any
  const wrapProps = wrapInArray(props) as R[]
  const res = {} as unknown as Pick<T, R>
  wrapProps.forEach((key: R) => {
    if (key in source) {
      res[key] = source[key]
    }
  })
  return res
}

export const keys: <O extends Record<string, any>>(obj: O) => (keyof O)[] = Object.keys

type AnyObject = Record<string, any>

type AssignCustomizer = (
  targetValue: any,
  sourceValue: any,
  key?: string,
  target?: AnyObject,
  source?: AnyObject,
) => any

const ObjectProto = Object.prototype
const hasOwnProperty = ObjectProto.hasOwnProperty
const isMergeableObject = (val: unknown) => isObject(val) && !isRegExp(val) && !isDate(val)

export function assignWith<T extends AnyObject, U extends AnyObject>(
  target: T,
  source: U,
  customizer: AssignCustomizer,
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
