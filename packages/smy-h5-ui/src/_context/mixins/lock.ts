import context from '../index'
import Vue from 'vue'

export function resolveLock() {
  const lockCounts = Object.keys(context.locks).length
  const bodyClassList = document.body.classList
  lockCounts <= 0 ? bodyClassList.remove('smy--lock') : bodyClassList.add('smy--lock')
}

export function addLock(uid: string) {
  Vue.set(context.locks, uid, 1)
  resolveLock()
}

export function releaseLock(uid: string) {
  Vue.delete(context.locks, uid)
  resolveLock()
}

export function createLockMixin(state: string, use: string) {
  const watch: Record<string, any> = {
    [state](newState: boolean) {
      const { _uid: uid } = this
      if (use && !(this as any)[use]) return
      ;(newState ? addLock : releaseLock)(uid)
    },
  }
  if (use) {
    watch[use] = function (newUse: boolean) {
      const { _uid: uid } = this
      ;(newUse ? addLock : releaseLock)(uid)
    }
  }
  return {
    watch,
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
      vm.$on('hook:activated', add)
      vm.$on('hook:deactivated', release)
    },
  }
}
