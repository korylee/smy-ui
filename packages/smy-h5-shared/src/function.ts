import { Func } from './is'

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
