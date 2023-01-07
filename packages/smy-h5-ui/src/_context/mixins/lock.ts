import context from '../index'
import Vue from 'vue'

export function resolveLock() {
  const lockCounts = Object.keys(context.locks).length
  const bodyClassList = document.body.classList
  lockCounts <= 0 ? bodyClassList.remove('m--lock') : bodyClassList.add('m--lock')
}

export function addLock(uid: string) {
  Vue.set(context.locks, uid, 1)
}

export function releaseLock(uid: string) {
  Vue.delete(context.locks, uid)
  resolveLock()
}

export function createLockMixin(state: string, use: string) {
  const propWatcher = use
    ? {
        [use](newValue: any) {
          if (!newValue) {
            releaseLock((this as any)._uid)
          } else if (newValue && (this as any)[state]) {
            addLock((this as any)._uid)
          }
        },
      }
    : {}
  return {
    watch: {
      ...propWatcher,
      [state](newValue: boolean) {
        if (use && !(this as any)[use]) return
        if (newValue) {
          addLock((this as any)._uid)
        } else {
          releaseLock((this as any)._uid)
        }
      },
    },
    beforeCreate() {
      const vm = this as any
      const add = () => {
        if (use && !vm[use]) return
        if (vm[state]) {
          addLock(vm._uid)
        }
      }
      const release = () => {
        if (use && !vm[use]) return
        if (vm[state]) {
          releaseLock(vm._uid)
        }
      }
      vm.$once('hook:beforeMount', add)
      vm.$once('hook:beforeDestroy', release)
      vm.$once('hook:activated', add)
      vm.$once('hook:deactivated', release)
    },
  }
}
