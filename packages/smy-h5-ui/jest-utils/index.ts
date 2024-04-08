import Vue from 'vue'
import { Wrapper } from '@vue/test-utils'
import { IN_BROWSER } from '@smy-h5/shared'

Vue.config.productionTip = false

export const delay = (time = 0) => new Promise((resolve) => setTimeout(resolve, time))

export function getTouch(el: Element | Window | Document, x: number, y: number) {
  return {
    identifier: Date.now(),
    target: el,
    pageX: x,
    pageY: y,
    clientX: x,
    clientY: y,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
  }
}

export function trigger(
  wrapper: Wrapper<Vue> | HTMLElement | Window | Document,
  eventName: string,
  x = 0,
  y = 0,
  offsetX = 0,
  offsetY = 0,
) {
  const el = 'element' in wrapper ? wrapper.element : wrapper
  const touchList = [getTouch(el, x, y)]

  const event = document.createEvent('CustomEvent')
  event.initCustomEvent(eventName, true, true, {})

  Object.assign(event, {
    clientX: x,
    clientY: y,
    offsetX,
    offsetY,
    touches: touchList,
    targetTouches: touchList,
    changedTouches: touchList,
  })
  el.dispatchEvent(event)

  return Vue.nextTick()
}

export async function triggerDrag(el: HTMLElement, relativeX: number, relativeY: number) {
  let x = relativeX
  let y = relativeY
  let startX = 0
  let startY = 0
  if (relativeX < 0) {
    startX = Math.abs(relativeX)
    x = 0
  }
  if (relativeY < 0) {
    startY = Math.abs(relativeY)
    y = 0
  }
  await trigger(el, 'touchstart', startX, startY)
  await trigger(el, 'touchmove', x / 4, y / 4)
  await trigger(el, 'touchmove', x / 3, y / 3)
  await trigger(el, 'touchmove', x / 2, y / 2)
  await trigger(el, 'touchmove', x, y)
  await delay(300)
  await trigger(el, 'touchend', x, y)
}

export function mockConsole(method: keyof Console, fn: any = () => {}) {
  const originMethod = console[method] as any
  console[method] = fn
  return () => {
    console[method] = originMethod
  }
}

export function mockGetBoundingClientRect(rect: Partial<DOMRect>): () => void {
  if (IN_BROWSER) {
    const spy = jest.spyOn(Element.prototype, 'getBoundingClientRect')
    spy.mockReturnValue(rect as DOMRect)
    return () => spy.mockRestore()
  }
  return () => {}
}
