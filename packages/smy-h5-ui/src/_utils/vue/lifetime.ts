import Vue from 'vue'

export function onMountedOrActivated(vm: Vue, cb: () => void) {
  let mounted = false
  vm.$on('hook:mounted', () => {
    mounted = true
    cb()
  })
  vm.$on('hook:activated', () => {
    mounted && cb()
  })
}
