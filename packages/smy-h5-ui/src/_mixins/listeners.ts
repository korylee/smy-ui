import { camelize, keys, upperFirst } from '../_utils/shared'
import type Vue from 'vue'

// eslint-disable-next-line @typescript-eslint/ban-types
type Listener = Function | Function[]

function getListeners(this: Vue, events?: string[], opts: { withOn?: boolean; emit?: boolean } = {}) {
  const { withOn = false, emit = true } = opts
  const { $listeners } = this
  if (!events) {
    if (!withOn) {
      return $listeners
    }
    events = keys($listeners)
  }
  return events.reduce((listeners, event) => {
    const listener = $listeners[event] ?? (emit && ((...args: any[]) => this.$emit(event, ...args)))
    if (!listener) {
      return listeners
    }
    const name = withOn ? `on${upperFirst(camelize(event))}` : event
    listeners[name] = listener
    return listeners
  }, {} as Record<string, Listener>)
}

function getListenersWithOn(this: Vue, events?: string[]) {
  return getListeners.call(this, events, { withOn: true })
}

export const ListenersMixin = {
  methods: {
    getListeners,
    getListenersWithOn,
  },
}
