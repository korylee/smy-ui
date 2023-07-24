import { onMounted, nextTick, onActivated } from 'vue'

export function onMountedOrActivated(hook: () => any) {
  let mounted: boolean

  onMounted(() => {
    hook()
    nextTick(() => {
      mounted = true
    })
  })

  onActivated(() => {
    mounted && hook()
  })
}
