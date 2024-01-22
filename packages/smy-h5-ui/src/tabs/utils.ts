import { ScrollerElement, cancelRaf, getScrollTop, raf, setScrollTop } from '../_utils/dom'

export function scrollLeftTo(scroller: HTMLElement, to: number, duration = 0, done?: () => void) {
  let rafId: number
  let count = 0
  const from = scroller.scrollLeft
  const frames = duration === 0 ? 1 : Math.round(+duration / 16)
  function animate() {
    scroller.scrollLeft += (to - from) / frames
    if (++count < frames) {
      rafId = raf(animate)
    } else if (done) {
      rafId = raf(done)
    }
  }
  animate()
  return () => cancelRaf(rafId)
}

export function scrollTopTo(scroller: ScrollerElement, to: number, duration: number, done?: () => void) {
  let rafId: number
  let current = getScrollTop(scroller)

  const isDown = current < to
  const frames = duration === 0 ? 1 : Math.round(duration / 16)
  const step = (to - current) / frames
  function animate() {
    current += step
    if ((isDown && current > to) || (!isDown && current < to)) {
      current = to
    }
    setScrollTop(scroller, current)

    if ((isDown && current < to) || (!isDown && current > to)) {
      rafId = raf(animate)
    } else if (done) {
      rafId = raf(done)
    }
  }

  animate()
  return () => cancelRaf(rafId)
}
