// @ts-nocheck
// touch事件模拟，解决在web端不能体验的问题
const inBrowser = typeof window !== 'undefined'
const supportTouch = 'ontouchstart' in window

let initiated = false
let eventTarget

const isMousedown = (eventType) => eventType === 'mousedown'

const isMousemove = (eventType) => eventType === 'mousemove'

const isMouseup = (eventType) => eventType === 'mouseup'

const isUpdateTarget = (eventType) => isMousedown(eventType) || !eventTarget?.dispatchEvent

function createTouch(target, identifier, mouseEvent) {
  const { clientX, clientY, screenX, screenY, pageX, pageY } = mouseEvent
  return { clientX, clientY, screenX, screenY, pageX, pageY, identifier, target }
}

function createTouchList() {
  const touchList = []
  touchList.item = function (index) {
    return this[index] || null
  }
  return touchList
}

function getActiveTouches(mouseEvent) {
  const { type } = mouseEvent
  if (isMouseup(type)) return createTouchList()
  return updateTouchList(mouseEvent)
}

function updateTouchList(mouseEvent) {
  const touchList = createTouchList()

  touchList.push(createTouch(eventTarget, 1, mouseEvent))
  return touchList
}

function triggerTouch(touchType, mouseEvent) {
  const { altKey, ctrlKey, metaKey, shiftKey } = mouseEvent
  const touchEvent = new Event(touchType, { bubbles: true, cancelable: true })

  touchEvent.altKey = altKey
  touchEvent.ctrlKey = ctrlKey
  touchEvent.metaKey = metaKey
  touchEvent.shiftKey = shiftKey

  const activeTouches = getActiveTouches(mouseEvent)
  touchEvent.touches = activeTouches
  touchEvent.targetTouches = activeTouches
  touchEvent.changedTouches = createTouchList()

  eventTarget.dispatchEvent(touchEvent)
}

function onMouse(mouseEvent, touchType) {
  const { type, target } = mouseEvent
  initiated = isMousedown(type) ? true : isMouseup(type) ? false : initiated
  if (isMousemove(type) && !initiated) return
  if (isUpdateTarget(type)) eventTarget = target
  triggerTouch(touchType, mouseEvent)

  if (isMouseup(type)) eventTarget = null
}

function createTouchEmulator() {
  window.addEventListener('mousedown', (event) => onMouse(event, 'touchstart'), true)
  window.addEventListener('mousemove', (event) => onMouse(event, 'touchmove'), true)
  window.addEventListener('mouseup', (event) => onMouse(event, 'touchend'), true)
}

if (inBrowser && !supportTouch) {
  createTouchEmulator()
}
