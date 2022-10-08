import context from '../index'
import Vue from 'vue'

export function resolveLock() {
  const lockCounts = Object.keys(context.locks).length
  const bodyClassList = document.body.classList
  lockCounts <= 0 ? bodyClassList.remove('m--lock') : bodyClassList.add('m--lock')
}

export function addLock(uid) {
  Vue.set(context.locks, uid, 1)
}

export function releaseLock(uid) {
  Vue.delete(context.locks, uid)
  resolveLock()
}

export function createLockMixin(state: string, use: string) {
  const propWatcher = use
    ? {
        [use](newValue) {
          if (!newValue) {
            releaseLock(this._uid)
          } else if (newValue && this[state]) {
            addLock(this._uid)
          }
        },
      }
    : {}
  return {
    watch: {
      ...propWatcher,
      [state](newValue: boolean) {
        if (use && !this[use]) return
        if (newValue) {
          addLock(this._uid)
        } else {
          releaseLock(this._uid)
        }
      },
    },
    beforeCreate() {
      const add = () => {
        if (use && !this[use]) return
        if (this[state]) {
          addLock(this._uid)
        }
      }
      const release = () => {
        if (use && !this[use]) return
        if (this[state]) {
          releaseLock(this._uid)
        }
      }
      this.$once('hook:beforeMount', add)
      this.$once('hook:beforeDestroy', release)
      this.$once('hook:activated', add)
      this.$once('hook:deactivated', release)
    },
  }
}
