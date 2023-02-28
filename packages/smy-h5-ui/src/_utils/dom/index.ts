import { isFunction } from '../is'

export function getAllParentScroller(el: HTMLElement): Array<HTMLElement | Window> {
  const allParentScroller: Array<HTMLElement | Window> = []
  let element: HTMLElement | Window = el
  while (element !== window) {
    element = getParentScroller(element as HTMLElement)
    allParentScroller.push(element)
  }
  return allParentScroller
}

type ScrollerElement = HTMLElement | Window

export function getParentScroller(el: HTMLElement, root: ScrollerElement = window): HTMLElement | Window {
  let element = el
  while (element && el !== root) {
    if (!element.parentNode) break
    element = element.parentNode as HTMLElement
    if (element === document.body || element === document.documentElement) {
      break
    }
    const scrollRE = /(scroll|auto)/
    const { overflowY, overflow } = window.getComputedStyle(element)
    if (scrollRE.test(overflowY) || scrollRE.test(overflow)) {
      return element
    }
  }
  return root
}

export const doubleRaf = (cb?: FrameRequestCallback, ctx?: any) => {
  const promise = new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve)
    })
  })
  if (!isFunction(cb)) return promise
  return promise.then(() => cb.call(ctx))
}

/**
 * 检查当前dom是否在视口，getBoundingClientRect这方案终究还是有性能问题，后续看有无必要换方案
 */
export async function inViewport(el: HTMLElement): Promise<boolean> {
  await doubleRaf()
  const { top, bottom, left, right } = el.getBoundingClientRect()
  const { innerWidth, innerHeight } = window
  const xInViewport = left <= innerWidth && right >= 0
  const yInViewport = top <= innerHeight && bottom >= 0

  return xInViewport && yInViewport
}

export const getScrollTopRoot = () =>
  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
