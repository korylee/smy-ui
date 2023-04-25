import { IN_BROWSER } from './env'
import { isFunction, isNumString, isNumber, isRem, isPx, isVw, isVh } from './is'

export function getAllParentScroller(el: HTMLElement): Array<HTMLElement | Window> {
  const allParentScroller: Array<HTMLElement | Window> = []
  for (let element = getParentScroller(el); element !== window; element = getParentScroller(element as HTMLElement)) {
    allParentScroller.push(element)
  }
  return allParentScroller
}

type ScrollerElement = HTMLElement | Window

export function getParentScroller(el: HTMLElement, root: ScrollerElement = window): HTMLElement | Window {
  let element = el
  while (element && element.parentNode && el !== root) {
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
 * 检查当前dom是否在视口，getBoundingClientRect这方案终究还是有性能问题，后续看有无必要换方案
 */
export function inViewport(el: HTMLElement): Promise<boolean> {
  return doubleRaf().then(() => {
    const { top, bottom, left, right } = el.getBoundingClientRect()
    const { innerWidth, innerHeight } = window
    const xInViewport = left <= innerWidth && right >= 0
    const yInViewport = top <= innerHeight && bottom >= 0

    return xInViewport && yInViewport
  })
}

export const getScrollTopRoot = () =>
  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

export function convertToUnit(str: string | number | null | undefined, unit = 'px'): string | undefined {
  if (str == null || str === '') return undefined
  if (isNumber(str) || isNumString(str)) return `${Number(str)}${unit}`
  if (isNaN(+str)) return String(str)
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
    const rootFontSize = window.getComputedStyle(document.documentElement).fontSize
    return num * parseFloat(rootFontSize)
  }
  // % and other
  return 0
}
