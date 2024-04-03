import { camelize, keys } from '@smy-h5/shared'
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

const slice = Array.prototype.slice

const createInvoker = (vm: Vue, name: string) => {
  const { $emit } = vm
  return function invoker() {
    // eslint-disable-next-line prefer-rest-params
    const args = slice.call(arguments)
    args.unshift(name)
    $emit.apply(vm, args as unknown as any)
  }
}

export function getListener(this: Vue, name: string) {
  const vm = this
  const { $listeners } = vm
  const camelizeName = camelize(name)
  return $listeners[name] ?? $listeners[camelizeName] ?? createInvoker(vm, name)
}

export const ListenersMixin = {
  methods: {
    getListener,
    getListeners,
  },
}
