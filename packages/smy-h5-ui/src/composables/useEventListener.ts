import { Ref, WatchStopHandle, getCurrentInstance, isRef, onUnmounted, unref, watch } from 'vue'
import { IN_BROWSER } from '../_utils/env'
import { onMountedOrActivated } from '../_utils/vue/onMountedOrActivated'

type TargetRef = EventTarget | Ref<EventTarget | undefined> | undefined

type UseEventListenerOptions = {
  target?: TargetRef
  capture?: boolean
  passive?: boolean
}

export function useEventListener<K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: UseEventListenerOptions
): () => void
export function useEventListener(type: string, listener: EventListener, options?: UseEventListenerOptions): () => void
export function useEventListener(type: string, listener: EventListener, options: UseEventListenerOptions = {}) {
  if (!IN_BROWSER) {
    return
  }
  const { target = window, passive = false, capture = false } = options
  let cleaned = false
  let attached: boolean
  let stopWatch: WatchStopHandle
  function add(target?: TargetRef) {
    if (cleaned) return
    const element = unref(target)

    if (!element || attached) return
    element.addEventListener(type, listener, {
      capture,
      passive,
    })
    attached = true
  }
  function remove(target?: TargetRef) {
    if (cleaned) return
    const element = unref(target)
    if (!element || !attached) return
    element.removeEventListener(type, listener, capture)
    attached = false
  }
  if (getCurrentInstance()) {
    onMountedOrActivated(() => add(target))
    onUnmounted(() => remove(target))
  } else {
    add(target)
  }

  if (isRef(target)) {
    stopWatch = watch(target, (val, oldVal) => {
      remove(oldVal)
      add(val)
    })
  }

  return () => {
    stopWatch?.()
    remove(target)
    cleaned = true
  }
}
