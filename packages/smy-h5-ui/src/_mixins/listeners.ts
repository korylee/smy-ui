import { call, camelize, kebabCase } from '@smy-h5/shared'
import type Vue from 'vue'

// eslint-disable-next-line @typescript-eslint/ban-types
type Listener = Function | Function[]

export function getListeners(this: Vue, events: string[]) {
  return events.reduce(
    (listeners, event) => {
      listeners[event] = getListener.call(this, event)
      return listeners
    },
    {} as Record<string, Listener>,
  )
}

export function getListener(this: Vue, name: string) {
  const vm = this
  const { $listeners } = vm
  const camelizeName = camelize(name)
  const kebabCaseName = kebabCase(name)
  return (
    $listeners[camelizeName] ??
    $listeners[kebabCaseName] ??
    ((...args: any[]) => {
      vm.$emit(kebabCaseName, ...args)
    })
  )
}

export function emit(vm: Vue, name: string, ...args: any[]) {
  const listener = getListener.call(vm, name)
  return call(listener as any, ...args)
}

export const ListenersMixin = {
  methods: {
    getListener,
    getListeners,
  },
}
