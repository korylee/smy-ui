import { call, camelize, kebabCase } from '@smy-h5/shared'
import Vue, { getCurrentInstance } from 'vue'

export const NOOP = () => {}

type Listener = Vue['$listeners'][string]

export function getListeners(events: string[]) {
  const result: Record<string, Listener> = {}
  return events.reduce((listeners, event) => {
    listeners[event] = getListener(event)
    return listeners
  }, result)
}
export function getListener(name: string): (...args: any[]) => any {
  const vm = getCurrentInstance()?.proxy
  if (!vm) {
    return NOOP
  }
  const { $listeners } = vm
  // const listeners = useListeners()
  const camelizeName = camelize(name)
  const kebabCaseName = kebabCase(name)
  const listener = $listeners[camelizeName] ?? $listeners[kebabCaseName]
  return (...args: any[]) => {
    if (listener) {
      return call(listener as any, ...args)
    }
    vm.$emit(name, ...args)
  }
}
