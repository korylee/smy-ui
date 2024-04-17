import { call, camelize, kebabCase, keys } from '@smy-h5/shared'
import type Vue from 'vue'

// eslint-disable-next-line @typescript-eslint/ban-types
type Listener = Function | Function[]

export function getListeners(this: Vue, events?: string[]) {
  const { $listeners } = this
  if (!events) {
    events = keys($listeners)
  }
  return events.reduce(
    (listeners, event) => {
      listeners[event] = getListener.call(this, event)
      return listeners
    },
    {} as Record<string, Listener>,
  )
}

const createInvoker =
  (vm: Vue, name: string) =>
  (...args: unknown[]) => {
    vm.$emit(name, ...args)
  }

export function getListener(this: Vue, name: string) {
  const vm = this
  const { $listeners } = vm
  const camelizeName = camelize(name)
  const kebabCaseName = kebabCase(name)
  const listener = $listeners[camelizeName] ?? $listeners[kebabCaseName] ?? createInvoker(vm, kebabCaseName)
  return (...args: any[]) => call(listener as any, ...args)
}

export const ListenersMixin = {
  methods: {
    getListener,
    getListeners,
  },
}
