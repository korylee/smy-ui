/* eslint-disable prefer-spread */
import { Func, MaybeArray, isArray } from './is'

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

export function call<F extends Func<P, any>, FS extends MaybeArray<F>, P>(funcs: FS, ...args: P[]): ReturnTypeMap<FS> {
  if (isArray(funcs)) {
    return funcs.map((func) => call.apply(null, ([func] as any).concat(args))) as any
  }
  return funcs.apply(null, args)
}

type ReturnTypeMap<T> = {
  [K in keyof T]: T[K] extends Func ? ReturnType<T[K]> : never
}
