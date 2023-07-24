import { cancelAnimationFrame, requestAnimationFrame } from '../_utils/dom'

export function scrollLeftTo(scoller: HTMLElement, to: number, duration = 0) {
  let rafId: number
  let count = 0
  const from = scoller.scrollLeft
  const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16)
  function animate() {
    scoller.scrollLeft += (to - from) / frames
    if (++count < frames) {
      rafId = requestAnimationFrame(animate)
    }
  }
  animate()
  return () => cancelAnimationFrame(rafId)
}
