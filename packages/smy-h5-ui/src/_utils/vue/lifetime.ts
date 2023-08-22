import Vue from 'vue'

export function onMountedOrActivated(vm: Vue, cb: () => void) {
  let mounted = false
  vm.$on('hook:mounted', () => {
    cb()
    vm.$nextTick(() => {
      mounted = true
    })
  })
  vm.$on('hook:activated', () => {
    mounted && cb()
  })
}
