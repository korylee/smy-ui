import { throwError } from '../_utils/smy/warn'

export const IconCache = (() => {
  const IconMap: Record<string, any> = {}

  function resolve(name: string) {
    return IconMap[name]
  }

  function use(name: string, component: any): void {
    if (IconMap[name]) {
      return throwError('icon/use', `${name} is exist`)
    }
    if (!component) {
      return
    }
    IconMap[name] = component
  }
  return {
    resolve,
    use,
  }
})()
