const DISTANCE_OFFSET = 12
export const EVENT_DELAY = 200
export const ANIMATION_DURATION = 200

type TouchStore = ReturnType<typeof createTouch>

export function createTouch(touchEvent: TouchEvent) {
  const { currentTarget: target, touches } = touchEvent
  const { clientX, clientY } = touches[0]
  return { target, clientX, clientY, timestamp: Date.now() }
}

function getDistance(touchA: TouchStore, touchB: TouchStore) {
  const { clientX: aX, clientY: aY } = touchA
  const { clientX: bX, clientY: bY } = touchB
  return Math.abs(Math.sqrt((aX - bX) ** 2 + (aY - bY) ** 2))
}

export function isDoubleTouch(prevTouch: TouchStore, nextTouch: TouchStore) {
  if (!prevTouch) return false
  return (
    getDistance(prevTouch, nextTouch) <= DISTANCE_OFFSET &&
    nextTouch.timestamp - prevTouch.timestamp <= EVENT_DELAY &&
    prevTouch.target === nextTouch.target
  )
}

export function isTapTouch(target: EventTarget, prevTouch: TouchStore, nextTouch: TouchStore) {
  if (!target || !nextTouch || !prevTouch) return false
  return (
    getDistance(nextTouch, prevTouch) <= DISTANCE_OFFSET &&
    [target, (<HTMLElement>target).parentNode].includes(nextTouch.target)
  )
}
