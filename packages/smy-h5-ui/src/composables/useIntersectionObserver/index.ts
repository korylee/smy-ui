import { Ref, WatchStopHandle, getCurrentInstance, isRef, onBeforeUnmount, shallowRef, unref, watch } from 'vue'
import { onMountedOrActivated } from '../../_utils/vue/onMountedOrActivated'
import './polyfill'

type UseIntersectionObserverTarget = Ref<HTMLElement | undefined> | HTMLElement | undefined

type IntersectObserveHandler = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void

export function useIntersectionObserver(
  target: UseIntersectionObserverTarget,
  handler?: IntersectObserveHandler,
  options?: IntersectionObserverInit
) {
  let stopWatch: WatchStopHandle | undefined
  let stoped = false
  let attached: boolean
  const isIntersecting = shallowRef(false)
  const observer = new IntersectionObserver((entries = [], observer) => {
    isIntersecting.value = entries.some((entry) => entry.isIntersecting)
    handler?.(entries, observer)
  }, options)

  const observe = (target: UseIntersectionObserverTarget) => {
    if (stoped) return
    const el = unref(target)
    if (!el || attached) return
    observer.observe(el)
    attached = true
  }

  const unobserve = (target: UseIntersectionObserverTarget) => {
    if (stoped) return
    const el = unref(target)
    if (!el || !attached) return
    observer.unobserve(el)
    isIntersecting.value = false
    attached = false
  }

  if (getCurrentInstance()) {
    onMountedOrActivated(() => observe(target))
    onBeforeUnmount(() => {
      observer.disconnect()
    })
  } else {
    observe(target)
  }

  if (isRef(target)) {
    stopWatch = watch(
      target,
      (val, oldVal) => {
        observe(val)
        unobserve(oldVal)
      },
      { flush: 'post' }
    )
  }

  const stop = () => {
    stopWatch?.()
    unobserve(target)
    stoped = true
  }
  return {
    stop,
    isIntersecting,
    observer,
  }
}
