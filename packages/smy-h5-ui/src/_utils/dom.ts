import { IN_BROWSER } from './env'
import { isFunction, isNumString, isNumber, isRem, isPx, isVw, isVh, isWindow } from './is'

export function getAllParentScroller(el: HTMLElement): Array<HTMLElement | Window> {
  const allParentScroller: Array<HTMLElement | Window> = []
  for (let element = getScrollParent(el); element !== window; element = getScrollParent(element as HTMLElement)) {
    allParentScroller.push(element)
  }
  return allParentScroller
}

const ELEMENT_NODE_TYPE = 1

const isElement = (node: Element) => !['HTML', 'BODY'].includes(node.tagName) && node.nodeType === ELEMENT_NODE_TYPE

export type ScrollerElement = HTMLElement | Window

const overflowScrollReg = /scroll|auto|overlay/i

export function getScrollParent(el: HTMLElement, root: ScrollerElement = window): HTMLElement | Window {
  let node = el
  while (node && node !== root && isElement(node)) {
    if ([document.body, document.documentElement].includes(node)) {
      break
    }
    const { overflow, overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflow) || overflowScrollReg.test(overflowY)) {
      return node
    }
    node = node.parentElement as HTMLElement
  }
  return root
}

export function requestAnimationFrame(fn: FrameRequestCallback): number {
  return IN_BROWSER ? globalThis.requestAnimationFrame(fn) : setTimeout(fn, 1000 / 60)
}

export function cancelAnimationFrame(handle: number): void {
  return IN_BROWSER ? globalThis.cancelAnimationFrame(handle) : clearTimeout(handle)
}

export const doubleRaf = (cb?: () => void, ctx?: any): Promise<void> => {
  const promise = new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
  if (!isFunction(cb)) return promise
  return promise.then(() => cb.call(ctx))
}

/**
 * 检查当前dom是否在视口
 */
export function inViewport(el: HTMLElement): Promise<boolean> {
  return doubleRaf().then(() => {
    const { top, bottom, left, right } = getRect(el)
    const { innerWidth, innerHeight } = window
    const xInViewport = left <= innerWidth && right >= 0
    const yInViewport = top <= innerHeight && bottom >= 0

    return xInViewport && yInViewport
  })
}

export const getScrollTopRoot = () =>
  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

export function getScrollTop(el: ScrollerElement): number {
  if (el === window) return getScrollTopRoot()
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset
  return Math.max(top, 0)
}

export function convertToUnit(str: string | number | null | undefined, unit = 'px'): string | undefined {
  if (str == null || str === '') return undefined
  if (isNumber(str) || isNumString(str)) return `${Number(str)}${unit}`
  if (isNaN(+str)) return str
  if (!isFinite(+str)) return undefined
  return `${Number(str)}${unit}`
}

export function toPxNum(value: number | string) {
  if (isNumber(value)) return value
  if (isNumString(value)) return +value
  if (isPx(value)) {
    return +value.replace('px', '')
  }
  if (isVw(value)) {
    return (+value.replace('vw', '') * globalThis.innerWidth) / 100
  }
  if (isVh(value)) {
    return (+value.replace('vh', '') * globalThis.innerHeight) / 100
  }
  if (isRem(value)) {
    const num = +value.replace('rem', '')
    const { fontSize: rootFontSize } = window.getComputedStyle(document.documentElement)
    return num * parseFloat(rootFontSize)
  }
  // % and other
  return 0
}

export const makeDomRect = (width = 0, height = 0) =>
  ({
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
  } as DOMRect)

export function getRect(el: Element | Window | undefined) {
  if (isWindow(el)) {
    const { innerWidth, innerHeight } = el
    return makeDomRect(innerWidth, innerHeight)
  }
  return el?.getBoundingClientRect?.() ?? makeDomRect()
}

export function getTranslate(el: HTMLElement) {
  const { transform } = window.getComputedStyle(el)
  return +transform.slice(transform.lastIndexOf(',') + 2, transform.length - 1)
}
