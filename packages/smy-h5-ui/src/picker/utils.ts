import { isArray } from '../_utils/is'
import { createNamespace } from '../_utils/vue/create'

export const getListeners = (vm: any, events: string[]) =>
  events.reduce((listeners, event) => {
    listeners[event] = (...args) => vm.$emit(event, ...args)
    return listeners
  }, {} as Record<string, (...args: unknown[]) => void>)

export function listEqual(listA: any[], listB: any[]) {
  if (!isArray(listA) || !isArray(listB)) return false
  if (listA === listB) return true
  if (listA.length !== listB.length) return false
  return listA.every((item, index) => item === listB[index])
}

const [name, bem] = createNamespace('picker')

export { name, bem }
